'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FaChevronDown, FaCheck } from 'react-icons/fa'

export interface PremiumSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface PremiumSelectProps {
  value: string
  onChange: (value: string) => void
  options: PremiumSelectOption[]
  placeholder?: string
  disabled?: boolean
  /** Shows a spinner-friendly label while an async options list is loading */
  loading?: boolean
  loadingLabel?: string
  /** Shown when options is empty and not loading */
  emptyLabel?: string
  className?: string
  id?: string
  /** Icon rendered inside the trigger, left-aligned (e.g. a category icon) */
  icon?: ReactNode
  /**
   * 'default' → compact rectangular trigger (admin forms, inline filters).
   * 'pill'    → tall, fully-rounded glass trigger for hero-style forms
   *             (matches the rest of that form's pill-shaped inputs).
   */
  variant?: 'default' | 'pill'
}

// A custom-built, fully themed dropdown that replaces the native <select>
// everywhere it's used across the site (public "Durood" category pickers)
// and the admin dashboard (Naat's Reciter / Category fields, and every
// other admin content form). Native <select> can't be styled beyond its
// trigger, so the open menu always looked like a plain OS control — this
// renders its own panel, so the whole thing — trigger, chevron, open menu,
// hover state, selected checkmark — matches the site's gold-on-green theme.
export default function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  loadingLabel = 'Loading...',
  emptyLabel = 'No options available',
  className = '',
  id,
  icon,
  variant = 'default',
}: PremiumSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const isDisabled = disabled || loading || options.length === 0
  const selected = options.find((o) => o.value === value)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keep the highlighted row in sync with the current value whenever the
  // menu opens, so keyboard nav starts from the current selection
  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value)
      setHighlighted(idx >= 0 ? idx : 0)
    }
  }, [open, value, options])

  const commit = (opt: PremiumSelectOption) => {
    if (opt.disabled) return
    onChange(opt.value)
    setOpen(false)
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = options[highlighted]
      if (opt) commit(opt)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  let triggerLabel = placeholder
  if (loading) triggerLabel = loadingLabel
  else if (options.length === 0) triggerLabel = emptyLabel
  else if (selected) triggerLabel = selected.label

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          variant === 'pill'
            ? `relative w-full h-14 flex items-center justify-between gap-2 rounded-full bg-white/10 backdrop-blur-md border pl-14 pr-5 text-left transition-all duration-200 ${
                open
                  ? 'border-gold-500 shadow-[0_0_0_3px_rgba(212,175,55,0.15)]'
                  : 'border-white/20 hover:border-gold-500/50'
              } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`
            : `w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-green-950 border rounded-lg text-sm text-left transition-all duration-200 ${
                open
                  ? 'border-gold-500 shadow-[0_0_0_3px_rgba(212,175,55,0.15)]'
                  : 'border-gold-500/20 hover:border-gold-500/50'
              } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`
        }
      >
        {icon && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none">
            {icon}
          </span>
        )}
        <span className={`truncate ${variant === 'pill' ? 'text-base' : 'text-sm'} ${selected ? 'text-white' : 'text-gray-400'}`}>
          {triggerLabel}
        </span>
        <FaChevronDown
          className={`text-gold-500 text-xs flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && !isDisabled && (
        <ul
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="premium-select-panel absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gold-500/25 bg-[#0e1a12] shadow-2xl shadow-black/50 py-1.5"
        >
          {options.map((opt, i) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => commit(opt)}
                disabled={opt.disabled}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                  i === highlighted && !opt.disabled ? 'bg-gold-500/15' : ''
                } ${
                  opt.value === value ? 'text-gold-400 font-medium' : 'text-gray-300'
                } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && (
                  <FaCheck className="text-gold-500 text-xs flex-shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
