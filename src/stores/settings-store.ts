import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface State {
  brushColor: string
  setBrushColor: (brushColor: string) => void
}

export const useSettingsStore = create<State>()(
  persist(
    (set) => ({
      brushColor: '#FFFFFF',
      setBrushColor: (brushColor) => set({ brushColor }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
