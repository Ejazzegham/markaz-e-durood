import ContentManager from '../ContentManager'
import { adminModels } from '@/lib/admin/models'

export default function AdminFaqPage() {
  const config = adminModels.faq
  return (
    <ContentManager
      modelKey={config.key}
      label={config.label}
      singularLabel={config.singularLabel}
      fields={config.fields}
      titleField={config.titleField}
      subtitleField={config.subtitleField}
      imageField={config.imageField}
    />
  )
}
