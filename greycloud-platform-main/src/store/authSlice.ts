import { RolesAllType } from "@/lib/schemas/common-schemas";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface UserStateType {
  id: string | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  companyId: string | number | null;
  company: string | null;
  role: RolesAllType;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserStateType;
  rememberMe: boolean;
  tempEmail: string | null;
}

interface AuthActions {
  storeUser: (user: UserStateType, remember: boolean) => void;
  removeUser: () => void;
  setTempEmail: (email: string) => void;
  updateUserField: <K extends keyof UserStateType>(field: K, value: UserStateType[K]) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) =>
        ({
          isAuthenticated: false,
          rememberMe: false,
          user: {
            id: null,
            name: null,
            surname: null,
            email: null,
            companyId: null,
            company: null,
            role: "Company_User",
          },
          setTempEmail: (email) => set({ tempEmail: email }),
          storeUser: (user, remember) => {
            set({
              isAuthenticated: true,
              user: { ...user, email: get().tempEmail || user.email }, // Merge tempEmail with user details
              rememberMe: remember,
              tempEmail: null, // Clear tempEmail after merge
            });
          },
          removeUser: () => {
            set({
              isAuthenticated: false,
              user: {
                id: null,
                name: null,
                surname: null,
                email: null,
                companyId: null,
                company: null,
                role: "Company_User",
              },
              rememberMe: false,
              tempEmail: null,
            });
          },
          updateUserField: (field, value) => {
            const currentUser = get().user;
            if (currentUser) {
              const updatedUser = { ...currentUser, [field]: value };
              set({ user: updatedUser });
            }
          },
        } as AuthState & AuthActions),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
