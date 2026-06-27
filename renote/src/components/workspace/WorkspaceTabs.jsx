import { Activity, Files, LayoutDashboard, Sparkles } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    value: "overview",
  },
  {
    icon: Files,
    label: "Files",
    value: "files",
  },
  {
    icon: Sparkles,
    label: "Summaries",
    value: "summaries",
  },
  {
    icon: Activity,
    label: "Activity",
    value: "activity",
  },
]

function WorkspaceTabs() {
  return (
    <Tabs className="overflow-x-auto" value="files">
      <TabsList className="border border-border/70 bg-background/80 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon

          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              <Icon className="size-4" />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export default WorkspaceTabs
