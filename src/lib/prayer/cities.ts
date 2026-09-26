export interface WorldCity {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  /** IANA timezone identifier, used to display times correctly for this city
   *  regardless of the visitor's own timezone. */
  timezone: string
}

// A practical "worldwide" spread of major cities — Pakistan/India first
// (this site's core audience), then the rest of the Muslim world and other
// major regions. Auto-detected location (via the browser) always takes
// priority when available; this list is the manual fallback/quick-pick.
export const WORLD_CITIES: WorldCity[] = [
  // Pakistan
  { id: 'faisalabad', name: 'Faisalabad', country: 'Pakistan', latitude: 31.4180, longitude: 73.0790, timezone: 'Asia/Karachi' },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436, timezone: 'Asia/Karachi' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
  { id: 'multan', name: 'Multan', country: 'Pakistan', latitude: 30.1575, longitude: 71.5249, timezone: 'Asia/Karachi' },
  { id: 'peshawar', name: 'Peshawar', country: 'Pakistan', latitude: 34.0151, longitude: 71.5249, timezone: 'Asia/Karachi' },
  { id: 'quetta', name: 'Quetta', country: 'Pakistan', latitude: 30.1798, longitude: 66.9750, timezone: 'Asia/Karachi' },
  // Saudi Arabia — the two Harams
  { id: 'makkah', name: 'Makkah', country: 'Saudi Arabia', latitude: 21.3891, longitude: 39.8579, timezone: 'Asia/Riyadh' },
  { id: 'madina', name: 'Madina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', latitude: 21.4858, longitude: 39.1925, timezone: 'Asia/Riyadh' },
  // Rest of the Middle East
  { id: 'dubai', name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'abu-dhabi', name: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
  { id: 'doha', name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar' },
  { id: 'kuwait-city', name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait' },
  { id: 'manama', name: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.5860, timezone: 'Asia/Bahrain' },
  { id: 'muscat', name: 'Muscat', country: 'Oman', latitude: 23.5859, longitude: 58.4059, timezone: 'Asia/Muscat' },
  { id: 'amman', name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284, timezone: 'Asia/Amman' },
  { id: 'baghdad', name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661, timezone: 'Asia/Baghdad' },
  { id: 'beirut', name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018, timezone: 'Asia/Beirut' },
  { id: 'damascus', name: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765, timezone: 'Asia/Damascus' },
  { id: 'jerusalem', name: 'Al-Quds (Jerusalem)', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Hebron' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkiye', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
  { id: 'ankara', name: 'Ankara', country: 'Turkiye', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul' },
  { id: 'tehran', name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890, timezone: 'Asia/Tehran' },
  // South Asia
  { id: 'delhi', name: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { id: 'hyderabad-in', name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { id: 'lucknow', name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 'Asia/Dhaka' },
  { id: 'colombo', name: 'Colombo', country: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezone: 'Asia/Colombo' },
  { id: 'kabul', name: 'Kabul', country: 'Afghanistan', latitude: 34.5553, longitude: 69.2075, timezone: 'Asia/Kabul' },
  // Southeast & Central Asia
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'tashkent', name: 'Tashkent', country: 'Uzbekistan', latitude: 41.2995, longitude: 69.2401, timezone: 'Asia/Tashkent' },
  // Africa
  { id: 'cairo', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'khartoum', name: 'Khartoum', country: 'Sudan', latitude: 15.5007, longitude: 32.5599, timezone: 'Africa/Khartoum' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi' },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
  { id: 'tunis', name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis' },
  { id: 'algiers', name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers' },
  // Europe / Americas / Oceania — the wider diaspora
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276, timezone: 'Europe/London' },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { id: 'new-york', name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { id: 'chicago', name: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
]

export const DEFAULT_CITY_ID = 'makkah'

export function findCityById(id: string): WorldCity | undefined {
  return WORLD_CITIES.find((c) => c.id === id)
}
