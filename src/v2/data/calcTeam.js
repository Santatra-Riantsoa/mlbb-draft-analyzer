import { METRICS } from './heroes.js'

export function calcTeam(heroes) {
  if (!heroes.length) return null
  const avg = (key) => heroes.reduce((s, h) => s + h[key], 0) / heroes.length

  const earlyMid = (avg("early") + avg("mid")) / 2

  const stats = {
    earlyMid,
    late: avg("late"),
    damage: avg("damage"),
    survive: avg("survive"),
    control: avg("control"),
    push: avg("push"),
    coord: avg("coord"),
  }

  // Scale to 0-10 (broadcast format: raw average × 2)
  const scaled = {}
  for (const key in stats) {
    scaled[key] = parseFloat((stats[key] * 2).toFixed(2))
  }

  // Lineup rating = average of all 7 scaled metrics, rounded to 1 decimal
  scaled.lineup = parseFloat(
    (METRICS.reduce((s, m) => s + scaled[m.key], 0) / METRICS.length).toFixed(1)
  )

  return scaled
}

/**
 * Calculate team stats with meta coefficient applied to lineup rating.
 * metaData: Map<heroName, { winrate, ... }> from metaApi.js
 *
 * The 7 metric bars stay unchanged (they represent the hero kit).
 * Lineup rating is adjusted: adjustedLineup = lineup * metaCoeff
 * where metaCoeff = average(heroWinRate / 50) across the team.
 */
export function calcTeamWithMeta(heroes, metaData) {
  const base = calcTeam(heroes)
  if (!base || !metaData || metaData.size === 0) return base

  // Compute meta coefficient
  let totalCoeff = 0
  let count = 0
  for (const hero of heroes) {
    const meta = metaData.get(hero.name)
    if (meta) {
      totalCoeff += meta.winrate / 50
      count++
    } else {
      totalCoeff += 1 // neutral if no data
      count++
    }
  }
  const metaCoeff = count > 0 ? totalCoeff / count : 1

  // Compute average winrate for meta score display
  let wrSum = 0
  let wrCount = 0
  for (const hero of heroes) {
    const meta = metaData.get(hero.name)
    if (meta) {
      wrSum += meta.winrate
      wrCount++
    }
  }

  base.lineup = parseFloat((base.lineup * metaCoeff).toFixed(1))
  base.metaCoeff = parseFloat(metaCoeff.toFixed(3))
  base.metaScore = wrCount > 0 ? parseFloat((wrSum / wrCount).toFixed(1)) : null

  return base
}
