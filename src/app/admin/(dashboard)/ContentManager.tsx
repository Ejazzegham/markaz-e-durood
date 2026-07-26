'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaUpload,
  FaStar,
  FaTimes,
  FaExclamationCircle,
  FaPen,
} from 'react-icons/fa'
import type { AdminModelKey, AdminFieldConfig } from '@/lib/admin/models'
import PremiumSelect from '@/components/ui/PremiumSelect'

interface ContentManagerProps {
  modelKey: AdminModelKey
  label: string
  singularLabel: string
  fields: AdminFieldConfig[]
  titleField: string
  subtitleField?: string
  imageField?: string
}

type Item = Record<string, any>

function emptyFormFromFields(fields: AdminFieldConfig[]) {
  const initial: Record<string, any> = {}
  for (const f of fields) {
    initial[f.name] = f.type === 'checkbox' ? false : ''
  }
  return initial
}

function formFromItem(item: Item, fields: AdminFieldConfig[]) {
  const initial: Record<string, any> = {}
  for (const f of fields) {
    if (f.type === 'checkbox') {
      initial[f.name] = !!item[f.name]
    } else {
      initial[f.name] = item[f.name] ?? ''
    }
  }
  return initial
}

function UploadField({
  value,
  onChange,
  kind,
  folder,
}: {
  value: string
  onChange: (url: string) => void
  kind: 'image' | 'pdf'
  folder: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const presignRes = await fetch('/api/admin/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          folder,
          kind,
        }),
      })
      const presignData = await presignRes.json()
      if (!presignRes.ok) {
        setError(presignData.error || 'Upload failed')
        return
      }

      // Upload the file straight to R2 from the browser — this bypasses
      // Vercel's serverless function body-size limit entirely.
      const putRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!putRes.ok) {
        setError('Upload failed. Please try again.')
        return
      }

      onChange(presignData.publicUrl)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 hover:border-gold-500/40 rounded-lg px-3 py-2 cursor-pointer transition-colors">
          {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
          {uploading ? 'Uploading...' : `Upload ${kind === 'pdf' ? 'PDF' : 'Image'}`}
          <input
            type="file"
            accept={kind === 'pdf' ? 'application/pdf' : 'image/*'}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {value && kind === 'image' && (
          <div className="relative w-10 h-10 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        {value && kind === 'pdf' && (
          <span className="text-xs text-green-400 truncate max-w-[160px]">File attached ✓</span>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`...or paste a ${kind === 'pdf' ? 'PDF' : 'image'} URL`}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

export default function ContentManager({
  modelKey,
  label,
  singularLabel,
  fields,
  titleField,
  subtitleField,
  imageField,
}: ContentManagerProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Record<string, any>>(emptyFormFromFields(fields))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  // For 'personSelect' fields (reciter/qari/performer): pull the real list
  // of profiles so admins pick a name instead of retyping it, which is what
  // used to cause videos to silently not show up on a profile page when the
  // typed name didn't match the profile name exactly.
  const personSelectField = fields.find((f) => f.type === 'personSelect')
  const [personOptions, setPersonOptions] = useState<{ id: string; name: string }[]>([])
  const [personOptionsLoading, setPersonOptionsLoading] = useState(false)

  useEffect(() => {
    const profileModel = personSelectField?.personSelectModel
    if (!profileModel) return
    let cancelled = false
    setPersonOptionsLoading(true)
    fetch(`/api/admin/content/${profileModel}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPersonOptions(data.items || [])
      })
      .finally(() => {
        if (!cancelled) setPersonOptionsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personSelectField?.personSelectModel])

  const loadItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/content/${modelKey}`)
      const data = await res.json()
      setItems(data.items || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // PremiumSelect is a custom button/panel, not a native <select>, so it
    // doesn't participate in HTML5 "required" form validation — check
    // required dropdown fields ourselves before hitting the API.
    const missingField = fields.find(
      (f) => f.required && (f.type === 'select' || f.type === 'personSelect') && !form[f.name]
    )
    if (missingField) {
      setError(`Please select a ${missingField.label.toLowerCase()}.`)
      return
    }

    setSaving(true)
    try {
      const isEditing = !!editingItem
      const url = isEditing
        ? `/api/admin/content/${modelKey}/${editingItem!.id}`
        : `/api/admin/content/${modelKey}`
      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not save. Please check the required fields.')
        return
      }
      setForm(emptyFormFromFields(fields))
      setEditingItem(null)
      setShowForm(false)
      loadItems()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleStartAdd = () => {
    if (showForm && !editingItem) {
      // Already adding — treat as a Cancel toggle
      setShowForm(false)
      return
    }
    setEditingItem(null)
    setForm(emptyFormFromFields(fields))
    setError('')
    setShowForm(true)
  }

  const handleStartEdit = (item: Item) => {
    setEditingItem(item)
    setForm(formFromItem(item, fields))
    setError('')
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setForm(emptyFormFromFields(fields))
    setError('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${singularLabel.toLowerCase()}? This can't be undone.`)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/content/${modelKey}/${id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((i) => i.id !== id))
      if (editingItem?.id === id) handleCancelForm()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{label}</h1>
          <p className="text-gray-500 text-sm">{items.length} {items.length === 1 ? singularLabel.toLowerCase() : label.toLowerCase()}</p>
        </div>
        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-ink-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          {showForm && !editingItem ? <FaTimes /> : <FaPlus />}
          {showForm && !editingItem ? 'Cancel' : `Add ${singularLabel}`}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gold-500">
              {editingItem ? `Editing ${singularLabel}` : `New ${singularLabel}`}
            </h2>
            {editingItem && (
              <button
                type="button"
                onClick={handleCancelForm}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-[10px]" /> Cancel edit
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2">
              <FaExclamationCircle className="flex-shrink-0" />
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              {field.type !== 'checkbox' && (
                <label className="block text-xs text-gray-400 mb-1.5">
                  {field.label} {field.required && <span className="text-gold-500">*</span>}
                </label>
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              )}

              {field.type === 'youtube' && (
                <input
                  type="text"
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              )}

              {field.type === 'personSelect' && (
                <>
                  <PremiumSelect
                    value={form[field.name] ?? ''}
                    onChange={(v) => setForm({ ...form, [field.name]: v })}
                    loading={personOptionsLoading}
                    loadingLabel="Loading profiles..."
                    emptyLabel="No profiles found"
                    placeholder="Select a profile..."
                    options={personOptions.map((p) => ({ value: p.name, label: p.name }))}
                  />
                  {!personOptionsLoading && personOptions.length === 0 && (
                    <p className="text-red-400 text-xs mt-1">
                      No profiles yet — add one under &ldquo;{field.personSelectModel}&rdquo; profiles first, then come back here.
                    </p>
                  )}
                </>
              )}

              {field.type === 'select' && (
                <PremiumSelect
                  value={form[field.name] ?? ''}
                  onChange={(v) => setForm({ ...form, [field.name]: v })}
                  placeholder={`Select ${field.label.toLowerCase()}...`}
                  options={(field.options || []).map((opt) => ({ value: opt, label: opt }))}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                />
              )}

              {(field.type === 'image' || field.type === 'pdf') && (
                <UploadField
                  value={form[field.name] ?? ''}
                  onChange={(url) => setForm({ ...form, [field.name]: url })}
                  kind={field.type}
                  folder={modelKey}
                />
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
                    className="rounded border-white/20 bg-white/5"
                  />
                  {field.label}
                </label>
              )}

              {field.helpText && field.type !== 'checkbox' && (
                <p className="text-gray-600 text-xs mt-1">{field.helpText}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-ink-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            {saving && <FaSpinner className="animate-spin" />}
            {saving
              ? (editingItem ? 'Updating...' : 'Saving...')
              : (editingItem ? `Update ${singularLabel}` : `Save ${singularLabel}`)}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          No {label.toLowerCase()} yet. Click &ldquo;Add {singularLabel}&rdquo; to add your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white/5 border rounded-xl overflow-hidden group transition-colors ${
                editingItem?.id === item.id ? 'border-gold-500/60' : 'border-white/10'
              }`}
            >
              {imageField && item[imageField] && (
                <div className="relative w-full h-36 bg-white/5">
                  <Image
                    src={item[imageField]}
                    alt={item[titleField] || ''}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate flex items-center gap-1.5">
                      {item.isFeatured && <FaStar className="text-gold-500 text-xs flex-shrink-0" />}
                      {item[titleField] || 'Untitled'}
                    </p>
                    {subtitleField && item[subtitleField] && (
                      <p className="text-gray-500 text-xs truncate mt-0.5">{item[subtitleField]}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="text-gray-500 hover:text-gold-500 transition-colors p-1.5"
                      title="Edit"
                    >
                      <FaPen className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1.5 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === item.id ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
