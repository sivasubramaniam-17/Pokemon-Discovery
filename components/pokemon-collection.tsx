"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import PokemonCard from "./pokemon-card"
import { getCollection, saveCollection } from "@/lib/pokemon-storage"
import type { Pokemon } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PokemonCollection() {
  const [collection, setCollection] = useState<Pokemon[]>([])

  useEffect(() => {
    setCollection(getCollection())
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(collection)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCollection(items)
    saveCollection(items)
  }

  const removePokemon = (pokemonId: number) => {
    const updatedCollection = collection.filter((p) => p.id !== pokemonId)
    setCollection(updatedCollection)
    saveCollection(updatedCollection)
  }

  const clearCollection = () => {
    setCollection([])
    saveCollection([])
  }

  if (collection.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pokemon in your collection yet</h3>
        <p className="text-gray-500">Go to the Discovery tab and start adding Pokemon to your collection!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Collection ({collection.length} Pokemon)</h2>
        <Button variant="outline" onClick={clearCollection} className="text-red-600 hover:text-red-700 bg-transparent">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Drag and drop Pokemon cards to reorder your collection!
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="collection">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {collection.map((pokemon, index) => (
                <Draggable key={pokemon.id} draggableId={pokemon.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-transform ${snapshot.isDragging ? "rotate-2 scale-105" : ""}`}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        showAddButton={false}
                        showRemoveButton={true}
                        onRemove={() => removePokemon(pokemon.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
