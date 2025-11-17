import { Button } from "@/components/ui/button"
import { ShareFat, EnvelopeSimple } from "@phosphor-icons/react"

interface ShareButtonsProps {
  url?: string
  title?: string
  description?: string
}

export function ShareButtons({ 
  url = "https://bensbar.github.io/ncaafbracket/",
  title = "2025-26 College Football Playoff Bracket | BensBar",
  description = "Check out the live College Football Playoff bracket!"
}: ShareButtonsProps) {
  
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }
  
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }
  
  const shareViaEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`${description}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={shareOnTwitter}
        variant="outline"
        size="sm"
        className="gap-2"
        title="Share on Twitter/X"
      >
        <ShareFat size={16} weight="fill" />
        <span className="hidden sm:inline">Twitter/X</span>
      </Button>
      <Button 
        onClick={shareOnFacebook}
        variant="outline"
        size="sm"
        className="gap-2"
        title="Share on Facebook"
      >
        <ShareFat size={16} weight="fill" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button 
        onClick={shareViaEmail}
        variant="outline"
        size="sm"
        className="gap-2"
        title="Share via Email"
      >
        <EnvelopeSimple size={16} weight="fill" />
        <span className="hidden sm:inline">Email</span>
      </Button>
    </div>
  )
}
