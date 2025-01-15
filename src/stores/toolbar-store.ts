import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ActionType = 'move' | 'select' | 'square' | 'circle' | 'draw'

interface State {
  toolbarAction: ActionType
  setToolbarAction: (action: ActionType) => void
}

export const useToolbarStore = create<State>()(
  persist(
    (set) => ({
      toolbarAction: 'select',
      setToolbarAction: (action) => set({ toolbarAction: action }),
    }),
    {
      name: 'toolbarActions',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
