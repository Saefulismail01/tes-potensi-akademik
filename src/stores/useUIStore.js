import { create } from 'zustand'

const useUIStore = create((set) => ({
  sidebarOpen: false,
  setSidebar: (v) => set({ sidebarOpen: v }),
}))

export default useUIStore
