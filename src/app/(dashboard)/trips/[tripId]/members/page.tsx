"use client"

import * as React from "react"
import { toast } from "sonner"
import { UsersIcon, UserPlusIcon, MailIcon, ShieldIcon, Trash2Icon, CrownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Member = {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
}

const INITIAL_MEMBERS: Member[] = [
  { id: "m-1", name: "You (Trip Lead)", email: "lead@globetrotter.io", role: "owner" },
  { id: "m-2", name: "Elena Rostova", email: "elena@example.com", role: "editor" },
  { id: "m-3", name: "Marco Bellini", email: "marco@example.com", role: "editor" },
]

export default function TripMembersPage() {
  const [members, setMembers] = React.useState<Member[]>(INITIAL_MEMBERS)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<"editor" | "viewer">("editor")

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address.")
      return
    }

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
    }

    setMembers([...members, newMember])
    setInviteEmail("")
    toast.success(`Invitation sent to ${newMember.email}!`)
  }

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
    toast.info("Member removed from trip party.")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">Trip Party & Collaborators</CardTitle>
                <CardDescription className="text-xs">
                  Travelers who have access to edit or view this trip
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {members.length} members
              </Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{member.name}</span>
                        {member.role === "owner" && (
                          <Badge variant="default" className="text-[10px] py-0 gap-1">
                            <CrownIcon className="size-2.5" />
                            Owner
                          </Badge>
                        )}
                        {member.role === "editor" && (
                          <Badge variant="secondary" className="text-[10px] py-0">Editor</Badge>
                        )}
                        {member.role === "viewer" && (
                          <Badge variant="outline" className="text-[10px] py-0">Viewer</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemove(member.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlusIcon className="size-4 text-primary" />
                Invite Traveler
              </CardTitle>
              <CardDescription className="text-xs">Send email invite to join planning</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="inviteEmail">Traveler Email</FieldLabel>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="friend@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="role">Permission Level</FieldLabel>
                  <Select value={inviteRole} onValueChange={(val) => setInviteRole(val as "editor" | "viewer")}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor (Can edit itinerary & budget)</SelectItem>
                      <SelectItem value="viewer">Viewer (Read-only access)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button type="submit" className="w-full gap-2">
                  <MailIcon className="size-4" />
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
