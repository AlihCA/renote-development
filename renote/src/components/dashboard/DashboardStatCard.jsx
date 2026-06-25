function DashboardStatCard({ description, icon: Icon, title, value }) {
  return (
    <article className="renote-card space-y-3 p-5">
      <div className="flex items-center gap-3">
        {Icon ? (
          <span className="renote-icon-container size-10">
            <Icon className="size-5" />
          </span>
        ) : null}
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      </div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  )
}

export default DashboardStatCard
