import { Outlet } from "react-router"

import PublicNavbar from "@/components/layout/PublicNavbar"

function PublicLayout() {
  return (
    <div className="renote-page flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="renote-container text-sm text-muted-foreground">
          ReNote prototype foundation
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
