import { useEffect, useMemo, useState } from "react"

import { ThemeContext, themeStorageKey } from "@/context/themeContextValue"

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light"
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)

  return storedTheme === "dark" ? "dark" : "light"
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  const value = useMemo(() => {
    function setTheme(nextTheme) {
      setThemeState((currentTheme) => {
        const requestedTheme =
          typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme

        return requestedTheme === "dark" ? "dark" : "light"
      })
    }

    function toggleTheme() {
      setTheme((currentTheme) =>
        currentTheme === "dark" ? "light" : "dark"
      )
    }

    return {
      isDark: theme === "dark",
      setTheme,
      theme,
      toggleTheme,
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export { ThemeProvider }
export default ThemeProvider
