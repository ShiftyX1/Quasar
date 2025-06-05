import type { User } from '../types/auth';

export function isFirstLogin(user: User | null): boolean {
  if (!user) return false;
  return user.metadata?.firstLogin === true;
}

export function needsProfileSetup(user: User | null): boolean {
  if (!user) return false;
  
  // Проверяем если у пользователя отсутствуют имя или фамилия
  const missingName = !user.firstName || !user.lastName;
  
  // Или если у него есть флаг firstLogin
  const hasFirstLoginFlag = isFirstLogin(user);
  
   
  return missingName || hasFirstLoginFlag;
}

export function getUserAvatarUrl(user: User | null, fallbackBackground?: string): string {
  if (user?.avatarUrl) {
    return user.avatarUrl;
  }
  
  return generateAvatarUrl(
    user?.firstName, 
    user?.lastName, 
    fallbackBackground || AVATAR_BACKGROUND_COLORS[0]
  );
}

export function generateAvatarUrl(firstName?: string, lastName?: string, background: string = '3b82f6'): string {
  const initials = [firstName?.charAt(0) || '', lastName?.charAt(0) || '']
    .filter(Boolean)
    .join('')
    .toUpperCase();
  
  const fallbackInitials = 'U';
  const displayInitials = initials || fallbackInitials;
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayInitials)}&size=128&background=${background}&color=ffffff&bold=true`;
}

export const AVATAR_BACKGROUND_COLORS = [
  '3b82f6', // blue
  'ef4444', // red
  '22c55e', // green
  'f59e0b', // amber
  '8b5cf6', // violet
  'ec4899', // pink
  '06b6d4', // cyan
  '84cc16', // lime
  'f97316', // orange
  '6366f1', // indigo
]; 