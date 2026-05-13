import { create } from 'zustand'

const useSessionStore = create((set) => ({
  mode: null,
  paketId: null,
  status: 'idle', // idle | active | paused | completed

  startSession(mode, paketId) {
    set({ mode, paketId, status: 'active' })
  },
  endSession() {
    set({ mode: null, paketId: null, status: 'idle' })
  },
  setStatus(status) {
    set({ status })
  },
}))

export default useSessionStore
