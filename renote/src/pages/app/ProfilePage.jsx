import { useEffect, useState } from "react"
import { useClerk, useUser } from "@clerk/clerk-react"
import {
  BookOpen,
  CalendarDays,
  Download,
  Eye,
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
import TrustBadge from "@/components/common/TrustBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockUsers } from "@/data"
import { cn } from "@/lib/utils"

const currentUserId = "user-student-mia"

const prototypeProfile = {
  bio: "Interested in capstone documentation, academic knowledge sharing, and practical security review materials.",
  email: "abinalalihsahcanda@gmail.com",
  joinedLabel: "Prototype account since June 2026",
  trustLabel: "community",
  username: "Alih.CA",
}

const roleDescriptions = {
  faculty:
    "Faculty accounts can publish trusted learning resources, review repositories, and guide students through curated academic materials.",
  guest:
    "Guest accounts can preview shared materials and request access where repository owners allow it.",
  institution:
    "Institution accounts can publish official repositories, templates, and verified study resources for the academic community.",
  student:
    "Student accounts can create repositories, organize resources, save collections, request access, and review AI summaries.",
}

function formatRole(role) {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Student"
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

function PreferenceToggle({ checked, description, label, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 transition-colors hover:border-primary/30 dark:border-primary/20 dark:bg-primary/5">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        checked={checked}
        className="mt-1 size-4 accent-primary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
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
              {formatRole(user.role)}
            </Badge>
            <TrustBadge level={profile.trustLabel}>Community</TrustBadge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-center dark:border-primary/20 dark:bg-primary/5">
          <p className="text-lg font-semibold">{user.stats.repositories}</p>
          <p className="text-xs text-muted-foreground">Repositories</p>
        </div>
        <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-center dark:border-primary/20 dark:bg-primary/5">
          <p className="text-lg font-semibold">{user.stats.collections}</p>
          <p className="text-xs text-muted-foreground">Collections</p>
        </div>
        <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-center dark:border-primary/20 dark:bg-primary/5">
          <p className="text-lg font-semibold">{user.stats.summaries}</p>
          <p className="text-xs text-muted-foreground">Summaries</p>
        </div>
      </div>
    </SectionCard>
  )
}

function ProfilePage() {
  const { signOut } = useClerk()
  const { isLoaded, user: clerkUser } = useUser()
  const user =
    mockUsers.find((item) => item.id === currentUserId) ?? mockUsers[0]
  const [profile, setProfile] = useState({
    bio: prototypeProfile.bio,
    course: user.course ?? "BS Information Technology",
    displayName: user.name,
    email: prototypeProfile.email,
    joinedLabel: prototypeProfile.joinedLabel,
    trustLabel: user.trustLabel ?? prototypeProfile.trustLabel,
    username: prototypeProfile.username,
  })
  const [hasSyncedClerkProfile, setHasSyncedClerkProfile] = useState(false)
  const [preferences, setPreferences] = useState({
    allowAccessRequests: true,
    defaultSummaryType: "detailed",
    defaultVisibility: "restricted",
    showPublicProfile: true,
  })
  const profileUser = {
    ...user,
    avatarInitials: getInitials(profile.displayName),
  }

  useEffect(() => {
    if (!isLoaded || !clerkUser || hasSyncedClerkProfile) {
      return
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      displayName: clerkUser.fullName ?? currentProfile.displayName,
      email:
        clerkUser.primaryEmailAddress?.emailAddress ?? currentProfile.email,
      username: clerkUser.username ?? currentProfile.username,
    }))
    setHasSyncedClerkProfile(true)
  }, [clerkUser, hasSyncedClerkProfile, isLoaded])

  function updateProfile(key, value) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [key]: value,
    }))
  }

  function updatePreference(key, value) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }))
  }

  function saveProfile(event) {
    event.preventDefault()
    toast("Profile changes will be connected later.")
  }

  function savePreferences() {
    toast("Workspace preferences saved for this prototype.")
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" })
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Manage your ReNote identity, role preview, and workspace preferences."
        icon={UserRound}
        title="Profile"
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProfileSummaryCard profile={profile} user={profileUser} />

          <SectionCard icon={ShieldCheck} title="Role and Trust">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
                  Current role: {formatRole(user.role)}
                </Badge>
                <TrustBadge level={profile.trustLabel}>Community</TrustBadge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {roleDescriptions[user.role] ?? roleDescriptions.student} Trust labels
                help viewers understand the source credibility of shared materials.
              </p>
              <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 text-sm leading-6 text-muted-foreground dark:border-primary/20 dark:bg-primary/5">
                Role verification and institutional trust labels will be connected
                during full authentication and administrative setup.
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Settings2} title="Account Actions">
            <div className="grid gap-2">
              <Button
                onClick={() => toast("Prototype data export will be connected later.")}
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
                onClick={() => toast("Delete account preview will be connected later.")}
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

          <SectionCard
            description="Set the defaults ReNote should use when creating and sharing study resources."
            icon={Eye}
            title="Workspace Preferences"
          >
            <div className="space-y-4">
              <PreferenceToggle
                checked={preferences.allowAccessRequests}
                description="Let other users request access to restricted or private repositories."
                label="Allow access requests"
                onChange={(value) => updatePreference("allowAccessRequests", value)}
              />
              <PreferenceToggle
                checked={preferences.showPublicProfile}
                description="Show your basic profile details beside shared public materials."
                label="Show public profile"
                onChange={(value) => updatePreference("showPublicProfile", value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Default repository visibility">
                  <Select
                    onValueChange={(value) => updatePreference("defaultVisibility", value)}
                    value={preferences.defaultVisibility}
                  >
                    <SelectTrigger className="w-full border-border bg-background/80">
                      <SelectValue placeholder="Choose visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Default summary type">
                  <Select
                    onValueChange={(value) => updatePreference("defaultSummaryType", value)}
                    value={preferences.defaultSummaryType}
                  >
                    <SelectTrigger className="w-full border-border bg-background/80">
                      <SelectValue placeholder="Choose summary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Summary</SelectItem>
                      <SelectItem value="concepts">Important Concepts</SelectItem>
                      <SelectItem value="review">Review Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex justify-end border-t border-[#E9C8F2]/70 pt-5 dark:border-primary/20">
                <Button onClick={savePreferences} type="button" variant="outline">
                  <Save className="size-4" />
                  Save preferences
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}

export default ProfilePage
