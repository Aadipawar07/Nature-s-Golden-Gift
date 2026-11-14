import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Addresses from './Addresses';

const accountApi = vi.hoisted(() => ({
  deleteAddress: vi.fn(),
  listAddresses: vi.fn(),
  saveAddress: vi.fn(),
  setDefaultAddress: vi.fn(),
}));

vi.mock('../../api/account', () => accountApi);

describe('Addresses form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountApi.listAddresses.mockResolvedValue([]);
  });

  it('uses the shared address schema to reject a non-six-digit pincode', async () => {
    const user = userEvent.setup();
    render(<Addresses />);

    await user.click(
      await screen.findByRole('button', { name: 'Add address' }),
    );
    await user.type(screen.getByLabelText('Name'), 'Sample Customer');
    await user.type(screen.getByLabelText('Phone'), '9876543210');
    await user.type(screen.getByLabelText('Pincode'), '12345');
    await user.type(screen.getByLabelText('Address line 1'), '12 Market Road');
    await user.type(screen.getByLabelText('City'), 'Pune');
    await user.type(screen.getByLabelText('State'), 'Maharashtra');
    await user.click(screen.getByRole('button', { name: 'Save address' }));

    expect(await screen.findByText('Pincode must be 6 digits')).toBeVisible();
    expect(accountApi.saveAddress).not.toHaveBeenCalled();
  });
});
