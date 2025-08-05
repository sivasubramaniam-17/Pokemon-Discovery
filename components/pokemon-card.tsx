"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Loader2 } from "lucide-react"
import { fetchPokemonDetails } from "@/lib/pokemon-api"
import { addToCollection, removeFromCollection, isInCollection } from "@/lib/pokemon-storage"
import type { Pokemon } from "@/lib/types"
import Image from "next/image"

interface PokemonCardProps {
  pokemon: Pokemon | { name: string; url: string }
  showAddButton?: boolean
  showRemoveButton?: boolean
  onRemove?: () => void
}

export default function PokemonCard({
  pokemon,
  showAddButton = false,
  showRemoveButton = false,
  onRemove,
}: PokemonCardProps) {
  const [isAdded, setIsAdded] = useState(() => {
    if ("id" in pokemon) {
      return isInCollection(pokemon.id)
    }
    return false
  })

  // Extract Pokemon ID from URL for API calls
  const pokemonId = "id" in pokemon ? pokemon.id : Number.parseInt(pokemon.url.split("/").slice(-2, -1)[0])

  const { data: pokemonDetails, isLoading } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => fetchPokemonDetails(pokemonId),
    enabled: !("id" in pokemon), // Only fetch if we don't already have details
  })

  const pokemonData = "id" in pokemon ? pokemon : pokemonDetails

  const handleAddToCollection = () => {
    if (pokemonData) {
      addToCollection(pokemonData)
      setIsAdded(true)
    }
  }

  const handleRemoveFromCollection = () => {
    if (pokemonData) {
      removeFromCollection(pokemonData.id)
      setIsAdded(false)
      onRemove?.()
    }
  }

  if (isLoading || !pokemonData) {
    return (
      <Card className="h-80">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    )
  }

  const typeColors: Record<string, string> = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-500",
    psychic: "bg-pink-500",
    ice: "bg-cyan-500",
    dragon: "bg-purple-500",
    dark: "bg-gray-800",
    fairy: "bg-pink-300",
    normal: "bg-gray-400",
    fighting: "bg-red-700",
    poison: "bg-purple-600",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    steel: "bg-gray-500",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing">
      <CardHeader className="text-center pb-2">
        <div className="relative w-32 h-32 mx-auto mb-2">
          <Image
            src={pokemonData.sprites.front_default || "/placeholder.svg?height=128&width=128"}
            alt={pokemonData.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold capitalize">{pokemonData.name}</h3>
        <p className="text-sm text-gray-500">#{pokemonData.id.toString().padStart(3, "0")}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1 justify-center">
          {pokemonData.types.map((type) => (
            <Badge
              key={type.type.name}
              className={`${typeColors[type.type.name] || "bg-gray-400"} text-white capitalize`}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">HP</p>
            <p className="font-semibold">{pokemonData.stats.find((s) => s.stat.name === "hp")?.base_stat || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">ATK</p>
            <p className="font-semibold">{pokemonData.stats.find((s) => s.stat.name === "attack")?.base_stat || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">DEF</p>
            <p className="font-semibold">{pokemonData.stats.find((s) => s.stat.name === "defense")?.base_stat || 0}</p>
          </div>
        </div>

        {showAddButton && (
          <Button
            onClick={handleAddToCollection}
            disabled={isAdded}
            className="w-full"
            variant={isAdded ? "secondary" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdded ? "Added to Collection" : "Add to Collection"}
          </Button>
        )}

        {showRemoveButton && (
          <Button onClick={handleRemoveFromCollection} variant="destructive" className="w-full">
            <Minus className="h-4 w-4 mr-2" />
            Remove from Collection
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
