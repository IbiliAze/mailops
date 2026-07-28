export class Stats {
  total!: number
  inbox!: number
  sent!: number
}

export class StatsResponse {
  stats!: Stats
  message!: string
}
