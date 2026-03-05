import { Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import './InfoTooltip.css'

interface InfoTooltipProps {
  label: string
  size?: number
}

export function InfoTooltip({ label, size = 14 }: InfoTooltipProps) {
  return (
    <Tooltip label={label} multiline w={260} withArrow>
      <span className="info-tooltip-trigger">
        <IconInfoCircle size={size} />
      </span>
    </Tooltip>
  )
}
