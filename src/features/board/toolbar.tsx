import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'
import { Circle, Hand, MousePointer, Pencil, Square } from 'lucide-react'
import { type ActionType, useToolbarStore } from '~/stores/toolbar-store'

const MemoizedToolbarItem = ({
  action,
  icon,
  label,
  onClick,
}: {
  action: ActionType
  icon: React.ReactNode
  label: string
  onClick: (action: ActionType) => void
}) => {
  return (
    <ToggleGroupItem
      value={action}
      aria-label={label}
      onClick={() => onClick(action)}
    >
      {icon}
    </ToggleGroupItem>
  )
}

const ToolbarItem = React.memo(MemoizedToolbarItem)

type Item = {
  action: ActionType
  icon: React.ReactNode
  label: string
}

const items: Item[] = [
  {
    action: 'move',
    icon: <Hand className="h-4 w-4 text-white" />,
    label: 'Move canvas',
  },
  {
    action: 'select',
    icon: <MousePointer className="h-4 w-4 text-white" />,
    label: 'Select Item',
  },
  {
    action: 'square',
    icon: <Square className="h-4 w-4 text-white" />,
    label: 'Insert Square',
  },
  {
    action: 'circle',
    icon: <Circle className="h-4 w-4 text-white" />,
    label: 'Insert Circle',
  },
  {
    action: 'draw',
    icon: <Pencil className="h-4 w-4 text-white" />,
    label: 'Draw',
  },
]

export const Toolbar = () => {
  const setToolbarAction = useToolbarStore((state) => state.setToolbarAction)

  const toolbarAction = useToolbarStore((state) => state.toolbarAction)

  const handleSelectAction = (action: ActionType) => {
    setToolbarAction(action)
  }

  return (
    <ToggleGroup
      className="absolute left-0 right-0 top-4 m-auto w-[200px] rounded-md bg-[#31303b]"
      type="single"
      value={toolbarAction}
    >
      {items.map((item) => {
        return (
          <ToolbarItem
            key={item.action}
            action={item.action}
            icon={item.icon}
            label={item.label}
            onClick={handleSelectAction}
          />
        )
      })}
    </ToggleGroup>
  )
}
