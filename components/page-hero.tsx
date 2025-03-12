import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function PageHero({
  title,
  description,
  icon: Icon,
  className,
}: PageHeroProps) {
  return (
    <div className={cn("bg-background border-b", className)}>
      <div className="container max-w-7xl mx-auto py-6 sm:py-8 px-4">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}