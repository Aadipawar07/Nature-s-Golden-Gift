import { useState } from 'react';
import { addressSchema, ADDRESS_TYPES } from '@ngg/shared/account';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Skeleton from '../../components/ui/Skeleton';
import Toast from '../../components/ui/Toast';
import {
  deleteAddress,
  listAddresses,
  saveAddress,
  setDefaultAddress,
} from '../../api/account';
import useApi from '../../hooks/useApi';

const emptyAddress = {
  name: '',
  phone: '',
  pincode: '',
  line1: '',
  line2: '',
  landmark: '',
  city: '',
  state: '',
  type: ADDRESS_TYPES.HOME,
};

const typeOptions = [
  { value: ADDRESS_TYPES.HOME, label: 'Home' },
  { value: ADDRESS_TYPES.WORK, label: 'Work' },
  { value: ADDRESS_TYPES.OTHER, label: 'Other' },
];

export default function Addresses() {
  const { data: addresses, loading, error, retry } = useApi(listAddresses);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState(emptyAddress);
  const [fieldErrors, setFieldErrors] = useState({});
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId(null);
    setValues(emptyAddress);
    setFieldErrors({});
    setActionError('');
    setFormOpen(true);
  }

  function startEdit(address) {
    setEditingId(address.id);
    setValues({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      line1: address.line1,
      line2: address.line2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      type: address.type,
    });
    setFieldErrors({});
    setActionError('');
    setFormOpen(true);
  }

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const parsed = addressSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path[0], issue.message]),
        ),
      );
      return;
    }

    setActionError('');
    setSaving(true);
    try {
      await saveAddress(parsed.data, editingId);
      setFormOpen(false);
      setNotice(editingId ? 'Address updated.' : 'Address added.');
      await retry();
    } catch (cause) {
      setActionError(cause.message || 'Unable to save this address.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddressAction(action, id, message) {
    setActionError('');
    try {
      await action(id);
      setNotice(message);
      await retry();
    } catch (cause) {
      setActionError(cause.message || 'Unable to update this address.');
    }
  }

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">Addresses</h2>
        {!formOpen ? (
          <Button type="button" onClick={startNew}>
            Add address
          </Button>
        ) : null}
      </div>

      {actionError ? (
        <p role="alert" className="text-error-fg">
          {actionError}
        </p>
      ) : null}

      {formOpen ? (
        <form
          className="grid gap-4 rounded-xl border border-cream-300 bg-white p-5 sm:grid-cols-2"
          noValidate
          onSubmit={handleSubmit}
        >
          <Input
            id="address-name"
            label="Name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={fieldErrors.name}
          />
          <Input
            id="address-phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            error={fieldErrors.phone}
          />
          <Input
            id="address-pincode"
            label="Pincode"
            inputMode="numeric"
            autoComplete="postal-code"
            value={values.pincode}
            onChange={(event) => updateField('pincode', event.target.value)}
            error={fieldErrors.pincode}
          />
          <Input
            id="address-line1"
            label="Address line 1"
            autoComplete="address-line1"
            value={values.line1}
            onChange={(event) => updateField('line1', event.target.value)}
            error={fieldErrors.line1}
          />
          <Input
            id="address-line2"
            label="Address line 2 (optional)"
            autoComplete="address-line2"
            value={values.line2}
            onChange={(event) => updateField('line2', event.target.value)}
            error={fieldErrors.line2}
          />
          <Input
            id="address-landmark"
            label="Landmark (optional)"
            value={values.landmark}
            onChange={(event) => updateField('landmark', event.target.value)}
            error={fieldErrors.landmark}
          />
          <Input
            id="address-city"
            label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => updateField('city', event.target.value)}
            error={fieldErrors.city}
          />
          <Input
            id="address-state"
            label="State"
            autoComplete="address-level1"
            value={values.state}
            onChange={(event) => updateField('state', event.target.value)}
            error={fieldErrors.state}
          />
          <Select
            id="address-type"
            label="Address type"
            options={typeOptions}
            value={values.type}
            onChange={(event) => updateField('type', event.target.value)}
            error={fieldErrors.type}
          />
          <div className="flex flex-wrap items-end gap-3">
            <Button type="submit" loading={saving}>
              Save address
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {!addresses?.length && !formOpen ? (
        <p className="rounded-xl border border-dashed border-cream-400 p-6 text-ink-600">
          No saved addresses yet.
        </p>
      ) : null}
      <div className="grid gap-4">
        {(addresses || []).map((address) => (
          <article
            className="grid gap-3 rounded-xl border border-cream-300 bg-white p-5"
            key={address.id}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold">{address.name}</h3>
              <span className="rounded-full bg-cream-100 px-3 py-1 text-sm">
                {address.type}
              </span>
              {address.isDefault ? (
                <span className="text-sm font-semibold text-leaf-700">
                  Default
                </span>
              ) : null}
            </div>
            <address className="not-italic text-ink-600">
              {[address.line1, address.line2, address.landmark]
                .filter(Boolean)
                .join(', ')}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.phone}
            </address>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => startEdit(address)}
              >
                Edit
              </Button>
              {!address.isDefault ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    handleAddressAction(
                      setDefaultAddress,
                      address.id,
                      'Default address updated.',
                    )
                  }
                >
                  Set as default
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  handleAddressAction(
                    deleteAddress,
                    address.id,
                    'Address deleted.',
                  )
                }
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
      <Toast message={notice} onClose={() => setNotice('')} />
    </div>
  );
}
