import Link from "next/link"
import { Card } from "@/components/ui/card"
import { getAllCategories } from "@/lib/db/queries"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Categories</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">Browse articles by topic</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((item) => (
            <Link key={item.category} href={`/category/${item.category.toLowerCase()}`}>
              <Card className="p-6 hover:border-primary/50 transition-all duration-300">
                <h2 className="text-2xl font-bold text-foreground mb-2">{item.category}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.count} {item.count === 1 ? "article" : "articles"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
