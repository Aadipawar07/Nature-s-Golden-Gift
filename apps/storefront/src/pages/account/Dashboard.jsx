import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import useApi from '../../hooks/useApi';
import { getProfile } from '../../api/account';

const cards = [
  ['/account/profile', 'Profile', 'Update your name and phone number.'],
  ['/account/addresses', 'Addresses', 'Manage your saved delivery addresses.'],
  ['/account/orders', 'Orders', 'Order history will be available soon.'],
];

export default function Dashboard() {
  const { data: profile, loading, error, retry } = useApi(getProfile);

  if (loading) {
    return (
      <div className="grid gap-4" aria-busy="true">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-28 w-full" />
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
        <h2 className="font-display text-2xl font-semibold">
          Welcome{profile?.name ? `, ${profile.name}` : ''}
        </h2>
        <p className="mt-2 text-ink-600">{profile?.email}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(([to, title, description]) => (
          <article
            key={to}
            className="grid gap-3 rounded-xl border border-cream-300 bg-white p-5"
          >
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="text-ink-600">{description}</p>
            <Link className="min-h-11 font-semibold underline" to={to}>
              Manage {title.toLowerCase()}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
