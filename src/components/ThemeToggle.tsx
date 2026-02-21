import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" || theme === "system" ? "light" : "dark")}
      className="p-2 mr-2 rounded-md hover:bg-muted transition-colors focus:outline-none"
      title="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
