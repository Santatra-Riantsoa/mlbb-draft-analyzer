const ICON_URL = 'https://raw.githubusercontent.com/Pren7/MLBB-Winrate/refs/heads/main/winrate.json'
const STATS_URL = 'https://mlbb-stats.rone.dev/api/hero-rank/'

/**
 * Fetch live meta data combining:
 * - Icons from Pren7/MLBB-Winrate
 * - Winrates from mlbb-stats.rone.dev filtered by Mythic Glory rank (pro level)
 *
 * Returns a Map: heroName → { winrate, pickrate, banrate, icon }
 */
export async function fetchMetaData() {
  try {
    // Fetch icons + glory-rank stats in parallel
    const [iconRes, statsRes] = await Promise.all([
      fetch(ICON_URL).then(r => r.ok ? r.json() : []).catch(() => []),
      fetchGloryStats(),
    ])

    // Build icon lookup
    const iconMap = new Map()
    for (const hero of iconRes) {
      const name = (hero.name || '').trim()
      if (name) iconMap.set(name, hero.icon || '')
    }

    // Build final map: stats from glory rank + icons from Pren7
    const map = new Map()

    for (const [name, stats] of statsRes) {
      map.set(name, {
        winrate: stats.winrate,
        pickrate: stats.pickrate,
        banrate: stats.banrate,
        icon: iconMap.get(name) || stats.icon || '',
      })
    }

    // Add heroes that have icons but no glory stats (use neutral 50% WR)
    for (const [name, icon] of iconMap) {
      if (!map.has(name)) {
        map.set(name, { winrate: 50, pickrate: 0, banrate: 0, icon })
      }
    }

    return map
  } catch {
    return new Map()
  }
}

/**
 * Fetch all hero stats from mlbb-stats.rone.dev filtered by Glory rank (Mythic+)
 * Falls back to Mythic, then all ranks if Glory data is unavailable.
 */
async function fetchGloryStats() {
  const ranks = ['glory', 'honor', 'mythic', 'all']

  for (const rank of ranks) {
    try {
      const url = `${STATS_URL}?days=7&rank=${rank}&size=132&sort_field=win_rate&sort_order=desc`
      const res = await fetch(url)
      if (!res.ok) continue

      const json = await res.json()
      const records = json?.data?.records
      if (!records || !records.length) continue

      const map = new Map()
      for (const entry of records) {
        const name = entry?.main_hero?.data?.name?.trim()
        if (!name) continue
        map.set(name, {
          winrate: parseFloat(((entry.main_hero_win_rate || 0.5) * 100).toFixed(1)),
          pickrate: parseFloat(((entry.main_hero_appearance_rate || 0) * 100).toFixed(2)),
          banrate: parseFloat(((entry.main_hero_ban_rate || 0) * 100).toFixed(2)),
          icon: entry?.main_hero?.data?.head || '',
        })
      }

      if (map.size > 0) return map
    } catch {
      continue
    }
  }

  return new Map()
}
