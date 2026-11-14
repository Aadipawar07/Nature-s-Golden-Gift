import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authError';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resetMessage =
  'If an account exists for that email, password reset instructions will be sent.';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setFieldError('Enter a valid email address.');
      return;
    }
    setFieldError('');
    setError('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setStatus(resetMessage);
    } catch (cause) {
      const message = getAuthErrorMessage(cause, 'reset');
      if (message === resetMessage) setStatus(message);
      else setError(message);
    } finally {
      setLoading(false);
    }
  }

  const next = searchParams.get('next');
  const loginPath = next ? `/login?next=${encodeURIComponent(next)}` : '/login';

  return (
    <section className="container-shell py-16">
      <div className="mx-auto grid max-w-md gap-6">
        <div className="grid gap-2 text-center">
          <p className="eyebrow">Account help</p>
          <h1 className="font-display text-4xl font-semibold">
            Reset your password
          </h1>
          <p className="text-ink-600">
            Enter your email to request password reset instructions.
          </p>
        </div>
        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <Input
            id="reset-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError}
          />
          {error ? (
            <p className="text-error-fg" role="alert">
              {error}
            </p>
          ) : null}
          {status ? <p role="status">{status}</p> : null}
          <Button type="submit" loading={loading}>
            Send instructions
          </Button>
        </form>
        <Link className="text-center text-sm underline" to={loginPath}>
          Back to sign in
        </Link>
      </div>
    </section>
  );
}
