import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PencilSimple } from "@phosphor-icons/react"

interface Team {
  rank: number
  name: string
}

interface EditBracketDialogProps {
  teams: Team[]
  onSave: (teams: Team[]) => void
}

export function EditBracketDialog({ teams, onSave }: EditBracketDialogProps) {
  const [open, setOpen] = useState(false)
  const [editedTeams, setEditedTeams] = useState(teams)

  const handleSave = () => {
    onSave(editedTeams)
    setOpen(false)
  }

  const updateTeam = (rank: number, name: string) => {
    setEditedTeams(prev => 
      prev.map(team => team.rank === rank ? { ...team, name } : team)
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <PencilSimple size={18} weight="bold" />
          Update Rankings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Update Team Rankings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editedTeams.map((team) => (
            <div key={team.rank} className="grid grid-cols-[80px_1fr] items-center gap-4">
              <Label htmlFor={`team-${team.rank}`} className="text-right font-bold text-accent">
                #{team.rank}
              </Label>
              <Input
                id={`team-${team.rank}`}
                value={team.name}
                onChange={(e) => updateTeam(team.rank, e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
