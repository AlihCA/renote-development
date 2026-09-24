import { Link } from "react-router"
import { ArrowUpRight, Bot, ChartNoAxesCombined, FileText, Users } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"

const destinations = [
  {
    title: "Users",
    description: "Account and role administration",
    href: "/app/admin/users",
    icon: Users,
  },
  {
    title: "Content",
    description: "Academic content oversight",
    href: "/app/admin/content",
    icon: FileText,
  },
  {
    title: "Usage",
    description: "Platform activity overview",
    href: "/app/admin/usage",
    icon: ChartNoAxesCombined,
  },
  {
    title: "AI Usage",
    description: "AI request and cost oversight",
    href: "/app/admin/ai-usage",
    icon: Bot,
  },
]

function AdminDashboardPage() {
  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Govern ReNote accounts, academic content, and platform usage. These areas are preview shells for the next workflow step."
        title="Admin Dashboard"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {destinations.map((destination) => (
          <SectionCard
            action={
              <Button asChild size="sm" variant="outline">
                <Link to={destination.href}>
                  Open {destination.title}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            }
            description={destination.description}
            icon={destination.icon}
            key={destination.href}
            title={destination.title}
          />
        ))}
      </div>
    </PageShell>
  )
}

export default AdminDashboardPage
