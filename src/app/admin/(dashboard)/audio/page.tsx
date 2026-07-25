import ContentManager from '../ContentManager'
import { adminModels } from '@/lib/admin/models'

export default function AdminAudioPage() {
  const config = adminModels.audio
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
