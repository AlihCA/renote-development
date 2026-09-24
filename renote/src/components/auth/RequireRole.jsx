import { Link } from "react-router"
import { ShieldAlert } from "lucide-react"

import PageShell from "@/components/common/PageShell"
import { Button } from "@/components/ui/button"
import useApplicationUser from "@/hooks/useApplicationUser"
import { canAccessRole, getRoleLabel } from "@/lib/roles"

// Frontend UX guard only. The future API must enforce permissions independently.
function RequireRole({ allowedRoles, children }) {
  const { appUser } = useApplicationUser()

  if (!appUser) return null
  if (canAccessRole(appUser.role, allowedRoles)) return children

  return (
    <PageShell className="py-12">
      <section className="renote-card mx-auto max-w-lg space-y-4 p-6 text-center">
        <ShieldAlert className="mx-auto size-8 text-primary" />
        <h1 className="text-xl font-semibold">This page is not in the {getRoleLabel(appUser.role)} preview</h1>
        <p className="text-sm text-muted-foreground">
          Switch the prototype role to preview this workspace area. Role selection here does not grant real access.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline"><Link to="/app/dashboard">Go to workspace</Link></Button>
          <Button asChild><Link to="/role-selection">Switch demo role</Link></Button>
        </div>
      </section>
    </PageShell>
  )
}

export default RequireRole
