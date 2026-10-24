export type SavedAuthMethod = 'email' | 'phone';

/**
 * Чем человек входил в прошлый раз: подставляем логин в поле, чтобы не
 * набирать его заново.
 *
 * Пароля здесь нет и быть не должно. Прежняя версия хранила его открытым
 * текстом рядом с логином: содержимое `localStorage` читает любой скрипт на
 * странице, любое расширение браузера с доступом к сайту и любой, кто сел за
 * компьютер, а пароли люди повторяют на других сервисах. Остаться в системе
 * позволяет `refreshToken`.
 */
export interface SavedAuthLogin {
  method: SavedAuthMethod;
  login: string;
  updatedAt: number;
}

const STORAGE_KEY = 'saved_auth_login_v2';

/** Ключ прежней версии: в нём лежал пароль */
const LEGACY_STORAGE_KEY = 'saved_auth_credentials_v1';

const isMethod = (value: unknown): value is SavedAuthMethod =>
  value === 'email' || value === 'phone';

/**
 * Забирает из старой записи метод и логин и стирает её вместе с паролем.
 *
 * У тех, кто уже входил, пароль лежит в браузере прямо сейчас, поэтому
 * чистка не ждёт ни следующего входа, ни открытия окна входа: её зовёт
 * `main.tsx` при старте приложения.
 */
export const takeOverLegacyEntry = (): SavedAuthLogin | null => {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  localStorage.removeItem(LEGACY_STORAGE_KEY);

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (!isMethod(parsed.method) || typeof parsed.login !== 'string') {
      return null;
    }

    const migrated: SavedAuthLogin = {
      method: parsed.method,
      login: parsed.login,
      updatedAt:
        typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));

    return migrated;
  } catch {
    return null;
  }
};

export const getSavedAuthLogin = (): SavedAuthLogin | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const migrated = takeOverLegacyEntry();

    if (raw === null) {
      return migrated;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (!isMethod(parsed.method) || typeof parsed.login !== 'string') {
      return null;
    }

    return {
      method: parsed.method,
      login: parsed.login,
      updatedAt:
        typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
};

export const saveAuthLogin = (
  value: Omit<SavedAuthLogin, 'updatedAt'> & { updatedAt?: number },
): void => {
  const payload: SavedAuthLogin = {
    method: value.method,
    login: value.login,
    updatedAt: value.updatedAt ?? Date.now(),
  };

  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};
