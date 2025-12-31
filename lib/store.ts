import { create } from 'zustand'

interface UserProfile {
  id: number
  email: string
  name: string
  bio: string
  avatar: string | null
}

interface UserState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (userData: UserProfile) => void
  signup: (userData: UserProfile) => void
  logout: () => void
  updateUser: (updates: Partial<UserProfile>) => void
  
  checkAuth: () => Promise<void> 
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true so we can show a loading spinner on refresh

  login: (userData) => set({ user: userData, isAuthenticated: true }),

  signup: (userData) => set({ user: userData, isAuthenticated: true }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),


  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me'); 
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}))