import { Client, Session } from '@noice-com/platform-client';
import { Auth } from '@noice-com/schemas/auth/auth.pb';
import { makeLoggers } from '@noice-com/utils';

const __SESSION_KEY = '__NoiceClientSession__';
const loggers = makeLoggers('SESSION');

// Helpers
export function saveSessionInStorage(session: Session): void {
  const sessionStr = JSON.stringify(session);

  if (typeof Storage === 'undefined') {
    loggers.logWarn(
      'Local storage not available on this device! Cannot save session token!',
    );

    return;
  }

  loggers.logInfoVerbose('Saving auth session to local storage.');
  localStorage.setItem(__SESSION_KEY, sessionStr);
}

export function getSessionFromStorage(): Session | null {
  // First check localStorage
  if (typeof Storage === 'undefined') {
    loggers.logWarn('Local storage not available on this device!');

    return null;
  }

  const sessionStr = localStorage.getItem(__SESSION_KEY);

  if (sessionStr) {
    const parsed = JSON.parse(sessionStr) as {
      auth: Auth;
      created: string;
    };

    return {
      auth: parsed.auth,
      created: new Date(parsed.created),
    };
  }

  return null;
}

export async function clearSession(client: Client): Promise<boolean> {
  try {
    await client.clearSession();
  } catch (e) {
    // It is okay for this to throw an error for few reasons
  }

  try {
    localStorage?.removeItem(__SESSION_KEY);
    return true;
  } catch (e) {
    // Below should never happen
    loggers.logError('Could not clear login session. Reason:', e);
  }

  return false;
}

export async function restoreSession(
  client: Client,
  signinPath: string,
  redirect = true,
): Promise<boolean> {
  let session = getSessionFromStorage();

  if (!session) {
    session = getSessionParamFromHash();
  }

  removeSessionFromHash();

  if (!session) {
    return false;
  }

  try {
    await client.restoreSession(session);
  } catch (e) {
    // Session is invalid, clear it
    loggers.logError('Failed to restore session', e);
    await clearSession(client);

    if (session.auth?.roles?.includes('full_user') && redirect) {
      // Full users should just be redirected to signin page
      document.location.href = signinPath;
      throw e;
    }

    return false;
  }

  loggers.logInfoVerbose('Retrieved session successfully from hash.');
  return true;
}

export function handleLogout(signupPath: string, roles: string[], redirect = true): void {
  try {
    localStorage?.removeItem(__SESSION_KEY);
  } catch (e) {
    loggers.logError('Could not clear login session. Reason:', e);
  }

  if (!redirect) {
    return;
  }

  if (roles.includes('full_user')) {
    document.location.href = signupPath;
  } else {
    document.location.reload();
  }
}

function getSessionParamFromHash(): Session | null {
  const hash = window.location.hash;
  const parts = hash.split('?');

  if (parts.length < 2) {
    return null;
  }

  const params = new URLSearchParams(parts[1]);
  const authStr = params.get('auth');

  if (authStr) {
    const parsed = JSON.parse(atob(authStr)) as Auth;

    return {
      auth: parsed,
      created: new Date(),
    };
  }

  return null;
}

function removeSessionFromHash(): void {
  const hash = window.location.hash;
  const parts = hash.split('?');

  if (parts.length < 2) {
    return;
  }

  const params = new URLSearchParams(parts[1]);
  params.delete('auth');
  window.location.hash = parts[0] + '?' + params.toString();
}
