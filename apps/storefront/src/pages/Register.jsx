import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authError';
import safeRedirect from '../utils/safeRedirect';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = 'Enter your name.';
    if (!emailPattern.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setError('');
    setStatus('');
    setLoading(true);
    try {
      const result = await register(name.trim(), email.trim(), password);
      setStatus(
        result.verificationSent
          ? 'Your account is ready. Check your email for a verification link; you can use your account now.'
          : 'Your account is ready, but the verification email could not be sent. You can use your account now.',
      );
    } catch (cause) {
      setError(getAuthErrorMessage(cause, 'register'));
    } finally {
      setLoading(false);
    }
  }

  const next = safeRedirect(searchParams.get('next'));

  return (
    <section className="container-shell py-16">
      <div className="mx-auto grid max-w-md gap-6">
        <div className="grid gap-2 text-center">
          <p className="eyebrow">Join us</p>
          <h1 className="font-display text-4xl font-semibold">
            Create an account
          </h1>
          <p className="text-ink-600">
            Save your details for a simpler checkout.
          </p>
        </div>
        {status ? (
          <div className="grid gap-4" role="status">
            <p>{status}</p>
            <Link
              className="btn-primary rounded-full px-5 py-3 text-center"
              to={next}
            >
              Continue
            </Link>
          </div>
        ) : (
          <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
            <Input
              id="register-name"
              label="Name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={fieldErrors.name}
            />
            <Input
              id="register-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldErrors.email}
            />
            <Input
              id="register-password"
              label="Password"
              type="password"
              autoComplete="new-password"
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
              Create account
            </Button>
          </form>
        )}
        {!status ? (
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link className="underline" to="/login">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
