import { useEffect, useState } from 'react';
import { profileSchema } from '@ngg/shared/account';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import Toast from '../../components/ui/Toast';
import { getProfile, updateProfile } from '../../api/account';
import useApi from '../../hooks/useApi';

export default function Profile() {
  const { data: profile, loading, error, retry } = useApi(getProfile);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || '');
    setPhone(profile.phone || '');
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();
    const candidate = { name: name.trim() };
    if (phone.trim()) candidate.phone = phone.trim();
    const parsed = profileSchema.safeParse(candidate);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path[0], issue.message]),
        ),
      );
      return;
    }

    setFieldErrors({});
    setSaveError('');
    setSaving(true);
    try {
      const updated = await updateProfile(parsed.data);
      setName(updated.name || '');
      setPhone(updated.phone || '');
      setNotice('Profile saved.');
    } catch (cause) {
      setSaveError(cause.message || 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4" aria-busy="true">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="grid gap-4">
        <p role="alert" className="text-error-fg">
          {error.message}
        </p>
        <Button type="button" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Profile</h2>
        <p className="mt-2 text-ink-600">{profile.email}</p>
      </div>
      <form className="grid max-w-xl gap-5" noValidate onSubmit={handleSubmit}>
        <Input
          id="profile-name"
          label="Name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />
        <Input
          id="profile-phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={fieldErrors.phone}
        />
        {saveError ? (
          <p role="alert" className="text-error-fg">
            {saveError}
          </p>
        ) : null}
        <Button type="submit" loading={saving}>
          Save profile
        </Button>
      </form>
      <Toast message={notice} onClose={() => setNotice('')} />
    </div>
  );
}
