import { AboutPanel } from "../AboutPanel/AboutPanel"
import { TechStackPanel } from "../TechStackPanel/TechStackPanel"

export const CornerPanels = () => (
  <div className="fixed right-4 bottom-4 z-40 flex max-w-[calc(100%-2rem)] flex-col items-end gap-3">
    <AboutPanel />
    <TechStackPanel />
  </div>
)
