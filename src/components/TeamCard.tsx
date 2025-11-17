import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface TeamCardProps {
  rank: number
  name: string
  delay?: number
}

export function TeamCard({ rank, name, delay = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="relative overflow-hidden bg-card hover:bg-card/80 transition-colors border-border p-3 min-w-[180px]">
        <div className="flex items-center gap-3">
          <Badge className="bg-accent text-accent-foreground font-bold text-sm shrink-0 h-8 w-8 flex items-center justify-center rounded-full">
            {rank}
          </Badge>
          <div className="font-semibold text-foreground text-sm leading-tight">
            {name}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
