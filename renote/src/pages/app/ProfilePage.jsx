import { useEffect, useState } from "react"
import { useClerk } from "@clerk/clerk-react"
import { Link } from "react-router"
import {
  BookOpen,
  CalendarDays,
  Download,
  LogOut,
  Mail,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useApplicationUser from "@/hooks/useApplicationUser"
import { APP_ROLES, getRoleLabel } from "@/lib/roles"
import { cn } from "@/lib/utils"

const prototypeProfile = {
  bio: "",
  joinedLabel: "Prototype account",
}

const roleDescriptions = {
  [APP_ROLES.FACULTY]:
    "Faculty course management and publishing controls are planned for a later step.",
  [APP_ROLES.STUDENT]:
    "Students will access materials made available to their courses.",
  [APP_ROLES.ADMIN]:
    "Admin user and content management controls are planned for a later step.",
}

function getInitials(value) {
  return String(value ?? "ReNote User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function Field({ children, label }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  )
}

function SectionCard({ children, className, description, icon: Icon, title }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[#E9C8F2]/80 bg-white p-5 shadow-sm dark:border-primary/20 dark:bg-card sm:p-6",
        className
      )}
    >
      <div className="mb-5 flex items-start gap-3">
        {Icon ? (
          <span className="renote-icon-container size-10 shrink-0">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}

function ProfileSummaryCard({ profile, user }) {
  return (
    <SectionCard description={profile.joinedLabel} icon={UserRound} title="Profile Summary">
      <div className="flex items-start gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-primary/10 text-xl font-semibold text-primary ring-1 ring-primary/15">
          {user.avatarInitials}
        </div>
        <div className="min-w-0 space-y-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {profile.displayName}
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              <span className="truncate">{profile.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </div>
      </div>

    </SectionCard>
  )
}

function ProfilePage() {
  const { signOut } = useClerk()
  const { appUser } = useApplicationUser()
  const [profile, setProfile] = useState({
    bio: prototypeProfile.bio,
    course: "",
    displayName: appUser?.displayName ?? "",
    email: appUser?.email ?? "",
    joinedLabel: prototypeProfile.joinedLabel,
    username: appUser?.username ?? "",
  })
  const [syncedUserId, setSyncedUserId] = useState(appUser?.id ?? null)
  const profileUser = {
    ...appUser,
    avatarInitials: getInitials(profile.displayName),
  }

  useEffect(() => {
    if (!appUser || syncedUserId === appUser.id) {
      return
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      displayName: appUser.displayName,
      email: appUser.email,
      username: appUser.username,
    }))
    setSyncedUserId(appUser.id)
  }, [appUser, syncedUserId])

  function updateProfile(key, value) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [key]: value,
    }))
  }

  function saveProfile(event) {
    event.preventDefault()
    toast("Updated locally for this demo.")
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" })
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Review your account details and prototype preferences."
        icon={UserRound}
        title="Settings"
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProfileSummaryCard profile={profile} user={profileUser} />

          <SectionCard icon={ShieldCheck} title="Role preview">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
                  Current role: {getRoleLabel(appUser?.role)}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {roleDescriptions[appUser?.role] ?? roleDescriptions[APP_ROLES.STUDENT]}
              </p>
              <div className="rounded-xl border border-primary/20 bg-accent/60 p-4 text-sm leading-6 text-muted-foreground dark:bg-primary/5">
                This role is saved only in your browser for the prototype. It does not grant production access.
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link to="/role-selection">Switch demo role</Link>
              </Button>
            </div>
          </SectionCard>

          <SectionCard icon={Settings2} title="Account Actions">
            <div className="grid gap-2">
              <Button
                onClick={() =>
                  toast("Data export will be connected during backend integration.")
                }
                type="button"
                variant="outline"
              >
                <Download className="size-4" />
                Export prototype data
              </Button>
              <Button
                onClick={handleSignOut}
                type="button"
                variant="outline"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
              <Button
                onClick={() =>
                  toast("Account deletion will be connected during backend integration.")
                }
                type="button"
                variant="outline"
              >
                <Trash2 className="size-4" />
                Delete account preview
              </Button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            description="These fields are local to the prototype until account management is connected."
            icon={BookOpen}
            title="Editable Profile"
          >
            <form className="space-y-5" onSubmit={saveProfile}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Display name">
                  <Input
                    className="border-border bg-background/80"
                    onChange={(event) => updateProfile("displayName", event.target.value)}
                    value={profile.displayName}
                  />
                </Field>
                <Field label="Username">
                  <Input
                    className="border-border bg-background/80"
                    onChange={(event) => updateProfile("username", event.target.value)}
                    value={profile.username}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    className="border-border bg-background/80"
                    onChange={(event) => updateProfile("email", event.target.value)}
                    type="email"
                    value={profile.email}
                  />
                </Field>
                <Field label="Course / department">
                  <Input
                    className="border-border bg-background/80"
                    onChange={(event) => updateProfile("course", event.target.value)}
                    value={profile.course}
                  />
                </Field>
              </div>

              <Field label="Bio / academic interest">
                <textarea
                  className="min-h-28 w-full rounded-3xl border border-border bg-background/80 px-3 py-2 text-sm leading-6 outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  onChange={(event) => updateProfile("bio", event.target.value)}
                  value={profile.bio}
                />
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E9C8F2]/70 pt-5 dark:border-primary/20">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {profile.joinedLabel}
                </p>
                <Button type="submit">
                  <Save className="size-4" />
                  Save profile
                </Button>
              </div>
            </form>
          </SectionCard>

        </div>
      </div>
    </PageShell>
  )
}

export default ProfilePage
