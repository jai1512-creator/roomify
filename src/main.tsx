import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./globals.css"
import Home from "./Home"
import Studio from "./Studio"
import { AuthProvider } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AccountPage from "./pages/AccountPage"
import DesignsPage from "./pages/DesignsPage"
import ExplorePage from "./pages/ExplorePage"
import HowItWorksPage from "./pages/HowItWorksPage"
import StylesPage from "./pages/StylesPage"
import InspirationPage from "./pages/InspirationPage"

function renderPage(pathname: string) {
  if (pathname.startsWith("/studio")) {
    return <Studio />
  }
  if (pathname.startsWith("/explore")) {
    return <ExplorePage />
  }
  if (pathname.startsWith("/how-it-works")) {
    return <HowItWorksPage />
  }
  if (pathname.startsWith("/styles")) {
    return <StylesPage />
  }
  if (pathname.startsWith("/inspiration")) {
    return <InspirationPage />
  }
  if (pathname.startsWith("/login")) {
    return <LoginPage />
  }
  if (pathname.startsWith("/signup")) {
    return <SignupPage />
  }
  if (pathname.startsWith("/account")) {
    return <AccountPage />
  }
  if (pathname.startsWith("/designs")) {
    return <DesignsPage />
  }
  return <Home />
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest("a")
      if (
        !anchor ||
        anchor.target ||
        anchor.hasAttribute("download") ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const href = anchor.getAttribute("href")
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http:") ||
        href.startsWith("https:") ||
        href.startsWith("//") ||
        href.startsWith("mailto:")
      ) {
        return
      }

      const url = new URL(anchor.href, window.location.origin)
      if (url.origin === window.location.origin) {
        event.preventDefault()
        window.history.pushState({}, "", url.pathname + url.search + url.hash)
        setPathname(url.pathname)
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener("popstate", handlePopState)
    document.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      document.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <AuthProvider>
      {renderPage(pathname)}
    </AuthProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)