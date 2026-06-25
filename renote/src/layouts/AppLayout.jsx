import { Outlet } from "react-router"

import AppSidebar from "@/components/layout/AppSidebar"
import AppTopbar from "@/components/layout/AppTopbar"

function AppLayout() {
  return (
    <div className="renote-page flex h-svh overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
