import Link from "next/link"
import { Card } from "@/components/ui/card"
import { getUsersWithCount } from "@/lib/blog-posts"

export default async function AuthorsPage() {
  
  const users = await getUsersWithCount();
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Authors</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">Meet the people behind the articles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {
          
          users.map((user) => {
            
            return (
              <Link key={user.id} href={`/author/${user.id}`}>
                <Card className="p-6 hover:border-primary/50 transition-all duration-300">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{user.bio}</p>
                  <p className="text-xs text-muted-foreground flex flex-1 items-end">
                    {user.postCount} {user.postCount === 1 ? "article" : "articles"}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
