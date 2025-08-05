"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import PokemonCard from "./pokemon-card"
import { fetchPokemonList } from "@/lib/pokemon-api"
import { Loader2 } from "lucide-react"

export default function PokemonDiscovery() {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length * 6
      }
      return undefined
    },
    initialPageParam: 0,
  })

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading Pokemon...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading Pokemon. Please try again.</p>
      </div>
    )
  }

  const allPokemon = data?.pages.flatMap((page) => page.results) || []

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} showAddButton={true} />
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading more Pokemon...</span>
          </div>
        )}
      </div>

      {!hasNextPage && allPokemon.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've discovered all Pokemon!</p>
        </div>
      )}
    </div>
  )
}
