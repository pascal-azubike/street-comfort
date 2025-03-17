interface PageHeroProps {
  title: string
  description: string
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <div className="bg-[#FDF7F5] border-b">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
