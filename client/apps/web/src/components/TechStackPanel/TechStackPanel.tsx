import { useState } from "react"
import { Layers, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const techGroups = [
  {
    title: "Frontend",
    items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Base UI", "Lucide"],
  },
  {
    title: "Stan i API",
    items: ["Redux Toolkit", "RTK Query"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express 5", "Prisma 7", "PostgreSQL"],
  },
  {
    title: "Narzędzia i wdrożenie",
    items: ["Turborepo", "Docker", "Supabase", "Render", "Cloudflare Pages"],
  },
]

export const TechStackPanel = () => {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="shadow-md"
        aria-expanded={false}
        aria-controls="tech-stack-panel"
        onClick={() => setIsOpen(true)}
      >
        <Layers />
        Technologie
      </Button>
    )
  }

  return (
    <aside
      id="tech-stack-panel"
      aria-label="Użyte technologie"
      className="w-72 max-w-full rounded-xl border bg-card p-4 text-sm shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Użyte technologie</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-expanded
          aria-controls="tech-stack-panel"
          onClick={() => setIsOpen(false)}
        >
          <X />
          <span className="sr-only">Ukryj</span>
        </Button>
      </div>
      <div className="mt-3 max-h-[40svh] space-y-3 overflow-y-auto">
        {techGroups.map((group) => (
          <section key={group.title}>
            <h3 className="text-xs tracking-wide text-muted-foreground uppercase">
              {group.title}
            </h3>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  )
}
