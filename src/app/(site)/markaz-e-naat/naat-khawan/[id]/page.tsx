'use client'

import { useParams } from 'next/navigation'
import { FaMicrophone } from 'react-icons/fa'
import PerformerTheaterPage from '@/components/resources/PerformerTheaterPage'

export default function NaatKhawanDetailPage() {
  const params = useParams<{ id: string }>()
  return (
    <PerformerTheaterPage
      profileModel="naatKhawan"
      contentModel="naat"
      profileId={params.id}
      backHref="/markaz-e-naat"
      kindLabel="Naat"
      subtitleFieldLabel="Reciter"
      accentIcon={FaMicrophone}
    />
  )
}
