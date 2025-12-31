import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import {getPostsByCategory, getAllCategories} from "@/lib/db/queries"

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat) => ({
    category: cat.category.toLowerCase(),
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  // Now use the 'category' variable we just extracted
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  
  const posts = await getPostsByCategory(category)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All categories
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">{categoryName}</h1>
            <p className="text-lg text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              if (!post.author) return null
              return <BlogCard key={post.id} post={post} author={post.author} />
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
