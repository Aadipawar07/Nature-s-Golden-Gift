import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from '../auth/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';

const auth = vi.hoisted(() => ({
  subscribeToAuth: vi.fn(),
  getIdToken: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock('../lib/auth', () => auth);

function renderPage(page, path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="*" element={page} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function LocationStatus() {
  const location = useLocation();
  return (
    <p role="status">
      {location.pathname}
      {location.search}
    </p>
  );
}

describe('authentication pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.subscribeToAuth.mockImplementation(async (onUser) => {
      onUser(null);
      return () => {};
    });
  });

  it('validates login fields before calling the auth module', async () => {
    const user = userEvent.setup();
    renderPage(<Login />, '/login');

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('maps login credential failures to a non-specific message', async () => {
    const user = userEvent.setup();
    auth.login.mockRejectedValue(
      Object.assign(new Error('private provider detail'), {
        code: 'auth/invalid-credential',
      }),
    );
    renderPage(<Login />, '/login');

    await user.type(screen.getByLabelText('Email'), 'person@example.test');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email or password is incorrect.',
    );
    expect(
      screen.queryByText('private provider detail'),
    ).not.toBeInTheDocument();
  });

  it('validates registration fields before calling the auth module', async () => {
    const user = userEvent.setup();
    renderPage(<Register />, '/register');

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Enter your name.')).toBeVisible();
    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
    expect(
      screen.getByText('Password must be at least 6 characters.'),
    ).toBeVisible();
    expect(auth.register).not.toHaveBeenCalled();
  });

  it('maps registration failures without exposing provider details', async () => {
    const user = userEvent.setup();
    auth.register.mockRejectedValue(
      Object.assign(new Error('email already registered'), {
        code: 'auth/email-already-in-use',
      }),
    );
    renderPage(<Register />, '/register');

    await user.type(screen.getByLabelText('Name'), 'Sample Customer');
    await user.type(screen.getByLabelText('Email'), 'person@example.test');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to create your account. Please check your details and try again.',
    );
    expect(
      screen.queryByText('email already registered'),
    ).not.toBeInTheDocument();
  });
});

describe('ProtectedRoute', () => {
  it('redirects signed-out users to login with a safe next path', async () => {
    auth.subscribeToAuth.mockImplementation(async (onUser) => {
      onUser(null);
      return () => {};
    });
    render(
      <MemoryRouter initialEntries={['/account/addresses?tab=recent']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/account/addresses"
                element={<p>Private addresses</p>}
              />
            </Route>
            <Route path="/login" element={<LocationStatus />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        '/login?next=%2Faccount%2Faddresses%3Ftab%3Drecent',
      ),
    ).toBeVisible();
    expect(screen.queryByText('Private addresses')).not.toBeInTheDocument();
  });
});
