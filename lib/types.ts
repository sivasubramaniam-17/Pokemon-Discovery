export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
  }
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
}
