'use client'

import { useParams } from 'next/navigation'
import { FaQuran } from 'react-icons/fa'
import PerformerTheaterPage from '@/components/resources/PerformerTheaterPage'

export default function QariDetailPage() {
  const params = useParams<{ id: string }>()
  return (
    <PerformerTheaterPage
      profileModel="qari"
      contentModel="qariRecitation"
      profileId={params.id}
      backHref="/markaz-e-naat"
      kindLabel="Recitation"
      subtitleFieldLabel="Qari"
      accentIcon={FaQuran}
    />
  )
}
