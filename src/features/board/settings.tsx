import React from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSettingsStore } from '~/stores/settings-store'

export const Settings = () => {
  const { brushColor, setBrushColor } = useSettingsStore(
    useShallow((state) => ({
      brushColor: state.brushColor,
      setBrushColor: state.setBrushColor,
    })),
  )

  if (!brushColor) return null

  return (
    <div className="absolute bottom-4 left-0 right-0 m-auto">
      <span>Color: </span>
      <input
        type="color"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
      />
    </div>
  )
}
