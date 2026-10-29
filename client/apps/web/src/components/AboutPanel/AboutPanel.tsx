import { useState } from "react"
import { Info, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export const AboutPanel = () => {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="shadow-md"
        aria-expanded={false}
        aria-controls="about-panel"
        onClick={() => setIsOpen(true)}
      >
        <Info />
        O aplikacji
      </Button>
    )
  }

  return (
    <aside
      id="about-panel"
      aria-label="O aplikacji"
      className="w-72 max-w-full rounded-xl border bg-card p-4 text-sm shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">O aplikacji</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-expanded
          aria-controls="about-panel"
          onClick={() => setIsOpen(false)}
        >
          <X />
          <span className="sr-only">Ukryj</span>
        </Button>
      </div>
      <p className="mt-3 text-muted-foreground">
        To aplikacja demonstrująca pracę z technologiami Redux Toolkit, RTK
        Query oraz shadcn/ui. Została również skonteneryzowana przy użyciu
        Dockera. Skupiłem się na poprawnej walidacji danych po stronie
        frontendu i backendu.
      </p>
    </aside>
  )
}
