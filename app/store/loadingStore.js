import { create } from 'zustand'

const useLoadingStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))

export default useLoadingStore