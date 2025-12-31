
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlogPost, Author } from "@/lib/blog-posts"

interface BlogCardProps {
  post: BlogPost
  author: Author
}

export function BlogCard({ post, author }: BlogCardProps) {

  function formatPostDate(date: string) {
    if (!date) return '';
    return new Date(date.replace(' ', 'T'))
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      .toLowerCase();
  }


  function getReadingTime(content: string) {
    const WORDS_PER_MINUTE = 200;
    const wordCount = content.split(/\s+/g).length;
    const minutes = wordCount / WORDS_PER_MINUTE;

    // Logic: If less than 1 minute, calculate seconds
    if (minutes < 1) {
      const seconds = Math.ceil(minutes * 60);
      return `${seconds} sec`;
    }

    return `${Math.ceil(minutes)} min`;
  }

  const calculatedTime = getReadingTime(post.content);

  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
      <Link href={`/posts/${post.id}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={author.avatar || "/placeholder.svg"} alt={author.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{author.name}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
              {
                formatPostDate(post.updated_at!)
              }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{calculatedTime} read</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
