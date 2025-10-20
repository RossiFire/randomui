import { create } from 'zustand'

interface NoisyBackgroundStore {
  active: boolean;
  isAnimationActive: boolean;
  toggleBackground: () => void;
  toggleAnimation: () => void;
}

const useNoisyBackgroundStore = create<NoisyBackgroundStore>((set) => ({
  active: true,
  isAnimationActive: true,
  toggleBackground: () => set((state) => ({ active: !state.active })),
  toggleAnimation: () => set((state) => ({ isAnimationActive: !state.isAnimationActive })),
}))

export default useNoisyBackgroundStore;