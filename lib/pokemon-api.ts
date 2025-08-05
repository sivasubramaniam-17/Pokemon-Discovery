import type { Pokemon } from "./types"

const BASE_URL = "https://pokeapi.co/api/v2"

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}

export async function fetchPokemonList(offset = 0, limit = 6): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list")
  }
  return response.json()
}

export async function fetchPokemonDetails(id: number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with id ${id}`)
  }
  return response.json()
}
