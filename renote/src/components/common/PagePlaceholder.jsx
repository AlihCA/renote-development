import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function PagePlaceholder({ eyebrow = "Phase 0", title, description, children }) {
  return (
    <section className="renote-container py-10">
      <Card className="renote-card">
        <CardHeader>
          <Badge className="w-fit" variant="secondary">
            {eyebrow}
          </Badge>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="max-w-2xl text-base">
            {description}
          </CardDescription>
        </CardHeader>
        {children ? <CardContent>{children}</CardContent> : null}
      </Card>
    </section>
  )
}

export default PagePlaceholder
