import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  role: string;
  organization_id?: number;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        login: (user, token) => {
          console.log('Setting token in store:', token);
          set({ 
            user, 
            accessToken: token, 
            isAuthenticated: true 
          }, undefined, { type: 'login' });
        },
        logout: () => set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        }, undefined, { type: 'logout' }),
        getToken: () => get().accessToken,
      }),
      {
        name: 'user-storage', // name of the item in localStorage
      }
    )
  ),
);
