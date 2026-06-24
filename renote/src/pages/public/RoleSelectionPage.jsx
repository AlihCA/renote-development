import PagePlaceholder from "@/components/common/PagePlaceholder"
import { Button } from "@/components/ui/button"

function RoleSelectionPage() {
  return (
    <PagePlaceholder
      description="Authentication is intentionally not connected yet. This page will later guide students, faculty, or admins into the correct sign-up flow."
      title="Role Selection"
    >
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary">Student</Button>
        <Button variant="secondary">Faculty</Button>
        <Button variant="secondary">Administrator</Button>
      </div>
    </PagePlaceholder>
  )
}

export default RoleSelectionPage
