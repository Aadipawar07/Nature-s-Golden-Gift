import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authError';
import safeRedirect from '../utils/safeRedirect';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const next = searchParams.get('next');
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : '';

  async function completeLogin(signIn) {
    setError('');
    setLoading(true);
    try {
      await signIn();
      navigate(safeRedirect(searchParams.get('next')), { replace: true });
    } catch (cause) {
      setError(getAuthErrorMessage(cause, 'login'));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!emailPattern.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Enter your password.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    return completeLogin(() => login(email.trim(), password));
  }

  return (
    <section className="container-shell py-16">
      <div className="mx-auto grid max-w-md gap-6">
        <div className="grid gap-2 text-center">
          <p className="eyebrow">Welcome back</p>
          <h1 className="font-display text-4xl font-semibold">Sign in</h1>
          <p className="text-ink-600">
            Sign in to manage your account and addresses.
          </p>
        </div>
        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
          />
          {error ? (
            <p className="text-error-fg" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
        <Button
          type="button"
          variant="secondary"
          loading={loading}
          onClick={() => completeLogin(loginWithGoogle)}
        >
          Continue with Google
        </Button>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <Link className="underline" to={`/forgot-password${nextQuery}`}>
            Forgot password?
          </Link>
          <Link className="underline" to={`/register${nextQuery}`}>
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
