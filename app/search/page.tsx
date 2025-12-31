"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { Input } from "@/components/ui/input"
import { searchPostsAction } from "./actions" // Import the action, NOT the lib

export default function SearchPage() {
  const [query, setQuery] = useState("")
  // State to store the fetched results
  const [results, setResults] = useState<any[]>([]) 
  // Optional: State to show loading spinner
  const [isSearching, setIsSearching] = useState(false)

  // Use useEffect to trigger the search when 'query' changes
  useEffect(() => {
    // Debounce: Wait 300ms after user stops typing to avoid too many DB calls
    const timer = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const data = await searchPostsAction(query);
        console.log("Search results::::::::::::::", data);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Cleanup function to cancel the timer if user types again
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">Search Articles</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, content, or tags..."
              className="pl-10 h-12 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Display Results */}
        {query && (
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">
               {isSearching ? "Searching..." : `${results.length} ${results.length === 1 ? "result" : "results"} for "${query}"`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((post) => {
                // Now we have both post and author ready to render
                if (!post.author) return null;
                  return <BlogCard key={post.id} post={post} author={post.author} />
              })}
            </div>

            {!isSearching && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}