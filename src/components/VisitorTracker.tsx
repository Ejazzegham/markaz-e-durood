'use client'

import { useEffect } from 'react'

const TRACK_STORAGE_KEY = 'markaz-visitor-tracked-on'

// Renders nothing — just fires a single "I was here" ping so this visitor
// is counted and placed on the homepage's worldwide visitor map. Guarded
// by localStorage so a visitor only counts once per calendar day no matter
// how many pages they browse, instead of once per page load.
export default function VisitorTracker() {
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const lastTracked = localStorage.getItem(TRACK_STORAGE_KEY)
      if (lastTracked === today) return
      localStorage.setItem(TRACK_STORAGE_KEY, today)
    } catch {
      // If localStorage is unavailable just track this page view — better
      // an occasional duplicate count than none at all.
    }

    fetch('/api/visitors/track', { method: 'POST' }).catch(() => {})
  }, [])

  return null
}
