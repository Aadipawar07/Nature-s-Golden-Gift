import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SESSION_HINT_CHANGE_EVENT } from '../hooks/useSessionHint';
import * as auth from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    let unsubscribe;

    auth
      .subscribeToAuth((nextUser) => {
        if (!active) return;
        setUser(nextUser);
        setLoading(false);
        if (nextUser) {
          localStorage.setItem('ngg.session', '1');
        } else {
          localStorage.removeItem('ngg.session');
        }
        window.dispatchEvent(new Event(SESSION_HINT_CHANGE_EVENT));
      })
      .then((stop) => {
        if (active) unsubscribe = stop;
        else stop();
      })
      .catch((cause) => {
        if (active) {
          setError(cause);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({ ...auth, user, loading, error }),
    [user, loading, error],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
