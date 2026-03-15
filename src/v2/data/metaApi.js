const META_URL = 'https://raw.githubusercontent.com/Pren7/MLBB-Winrate/refs/heads/main/winrate.json'

/**
 * Fetch live meta data from Pren7/MLBB-Winrate.
 * Returns a Map: heroName → { winrate, pickrate, banrate, icon }
 * Falls back to an empty Map on error.
 */
export async function fetchMetaData() {
  try {
    const res = await fetch(META_URL)
    if (!res.ok) return new Map()
    const data = await res.json()

    const map = new Map()
    for (const hero of data) {
      // Normalize name: trim, handle casing
      const name = (hero.name || '').trim()
      if (!name) continue
      map.set(name, {
        winrate: parseFloat(hero.winrate) || 50,
        pickrate: parseFloat(hero.pickrate) || 0,
        banrate: parseFloat(hero.banrate) || 0,
        icon: hero.icon || '',
      })
    }
    return map
  } catch {
    return new Map()
  }
}
