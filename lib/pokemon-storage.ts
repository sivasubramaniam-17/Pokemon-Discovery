import type { Pokemon } from "./types"

const COLLECTION_KEY = "pokemon-collection"

export function getCollection(): Pokemon[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(COLLECTION_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading collection from localStorage:", error)
    return []
  }
}

export function saveCollection(collection: Pokemon[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection))
  } catch (error) {
    console.error("Error saving collection to localStorage:", error)
  }
}

export function addToCollection(pokemon: Pokemon): void {
  const collection = getCollection()

  // Check if Pokemon is already in collection
  if (!collection.some((p) => p.id === pokemon.id)) {
    collection.push(pokemon)
    saveCollection(collection)
  }
}

export function removeFromCollection(pokemonId: number): void {
  const collection = getCollection()
  const updatedCollection = collection.filter((p) => p.id !== pokemonId)
  saveCollection(updatedCollection)
}

export function isInCollection(pokemonId: number): boolean {
  const collection = getCollection()
  return collection.some((p) => p.id === pokemonId)
}
