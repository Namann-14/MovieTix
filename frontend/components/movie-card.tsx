import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="aspect-[2/3] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-t-lg flex items-center justify-center">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl || "/placeholder.svg"}
              alt={movie.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="text-6xl text-primary/30">🎬</div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
              {movie.title}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(movie.durationInMinutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(movie.releaseDate)}</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {movie.genre}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
