"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PokemonDiscovery from "@/components/pokemon-discovery"
import PokemonCollection from "@/components/pokemon-collection"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

export default function PokemonApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokemon Discovery</h1>
            <p className="text-gray-600">Discover Pokemon and build your personal collection</p>
          </div>

          <Tabs defaultValue="discovery" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="discovery">Discover Pokemon</TabsTrigger>
              <TabsTrigger value="collection">My Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="discovery">
              <PokemonDiscovery />
            </TabsContent>

            <TabsContent value="collection">
              <PokemonCollection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  )
}
