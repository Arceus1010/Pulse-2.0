import ProgressBar from '../../../components/ui/ProgressBar'
import { SENTIMENT_COLORS } from '../constants'

interface Props {
  positive: number
  neutral: number
  negative: number
  height?: number
  animated?: boolean
  className?: string
}

export default function SentimentBar({ positive, neutral, negative, height = 6, animated, className }: Props) {
  return (
    <ProgressBar
      segments={[
        { width: positive, color: SENTIMENT_COLORS.positive },
        { width: neutral,  color: SENTIMENT_COLORS.neutral },
        { width: negative, color: SENTIMENT_COLORS.negative },
      ]}
      height={height}
      animated={animated}
      className={className}
    />
  )
}
