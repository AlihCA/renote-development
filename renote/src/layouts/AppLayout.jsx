import { Outlet } from "react-router"

import AppSidebar from "@/components/layout/AppSidebar"
import AppTopbar from "@/components/layout/AppTopbar"

function AppLayout() {
  return (
    <div className="renote-page flex">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
