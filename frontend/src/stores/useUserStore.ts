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
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        login: (user, token) => set({ user, accessToken: token, isAuthenticated: true }, undefined, { type: 'login' }),
        logout: () => set({ user: null, accessToken: null, isAuthenticated: false }, undefined, { type: 'logout' }),
      }),
      {
        name: 'user-storage', // name of the item in localStorage
      }
    )
  ),
);
