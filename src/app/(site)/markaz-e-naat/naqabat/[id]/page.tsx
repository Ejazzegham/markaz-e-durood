'use client'

import { useParams } from 'next/navigation'
import { FaBullhorn } from 'react-icons/fa'
import PerformerTheaterPage from '@/components/resources/PerformerTheaterPage'

export default function NaqabatDetailPage() {
  const params = useParams<{ id: string }>()
  return (
    <PerformerTheaterPage
      profileModel="naqabat"
      contentModel="naqabatVideo"
      profileId={params.id}
      backHref="/markaz-e-naat"
      kindLabel="Naqabat"
      subtitleFieldLabel="Naqeeb"
      accentIcon={FaBullhorn}
    />
  )
}
