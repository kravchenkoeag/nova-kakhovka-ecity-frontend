//  packages/types/src/models/user.ts

// Ролі користувачів
export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// Статус користувача
export interface UserStatus {
  message: string;
  is_visible: boolean;
  updated_at: string;
}

// Геолокація користувача
export interface UserLocation {
  type: string; // "Point"
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  city?: string;
}

// Модель користувача
export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  avatar?: string;

  // Ролі та права
  role: UserRole;
  is_moderator: boolean; // Legacy field

  // Статус акаунту
  is_verified: boolean;
  is_blocked: boolean;
  block_reason?: string; // NEW: Причина блокування
  blocked_at?: string; // NEW: Час блокування (ISO string)

  // Групи та інтереси
  groups: string[];
  interests?: string[];

  // Статус
  status: UserStatus;

  // Локація
  location?: UserLocation;

  // Часові мітки
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Відповідь для заблокованого користувача
export interface BlockedUserResponse {
  error: string;
  is_blocked: boolean;
  block_reason?: string;
  blocked_at?: string;
  message: string;
}

// Дані користувача для форм
export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Фільтр для пошуку користувачів
export interface UserFilter {
  search?: string;
  role?: UserRole;
  is_blocked?: boolean;
  is_verified?: boolean;
}

// Допоміжні функції для роботи з користувачами
export const UserHelpers = {
  // Отримати повне ім'я користувача
  getFullName: (user: User): string => {
    return `${user.first_name} ${user.last_name}`.trim() || user.email;
  },

  // Отримати ініціали користувача
  getInitials: (user: User): string => {
    const firstInitial = user.first_name?.[0]?.toUpperCase() || "";
    const lastInitial = user.last_name?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || user.email[0].toUpperCase();
  },

  // Перевірити чи користувач може модерувати
  canModerate: (user: User): boolean => {
    return (
      user.role === UserRole.MODERATOR ||
      user.role === UserRole.ADMIN ||
      user.role === UserRole.SUPER_ADMIN
    );
  },

  // Перевірити чи користувач є адміністратором
  isAdmin: (user: User): boolean => {
    return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  },

  // Отримати текстову назву ролі
  getRoleLabel: (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      [UserRole.USER]: "Користувач",
      [UserRole.MODERATOR]: "Модератор",
      [UserRole.ADMIN]: "Адміністратор",
      [UserRole.SUPER_ADMIN]: "Супер Адміністратор",
    };
    return labels[role] || "Користувач";
  },

  // Отримати колір для ролі
  getRoleColor: (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.USER]: "gray",
      [UserRole.MODERATOR]: "blue",
      [UserRole.ADMIN]: "purple",
      [UserRole.SUPER_ADMIN]: "red",
    };
    return colors[role] || "gray";
  },
};
