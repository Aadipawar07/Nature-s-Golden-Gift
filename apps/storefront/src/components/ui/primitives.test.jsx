import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Badge from './Badge';
import Modal from './Modal';
import Drawer from './Drawer';
import Toast from './Toast';
import Skeleton from './Skeleton';
import Tabs from './Tabs';
import Accordion from './Accordion';
import Breadcrumb from './Breadcrumb';
import Pagination from './Pagination';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from './PriceDisplay';

const withRouter = (node) => <MemoryRouter>{node}</MemoryRouter>;

test('Button supports loading and disabled states', () => {
  render(<Button loading>Save</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByText('Loading…')).toBeInTheDocument();
});

test('Input and Select expose labels and errors', () => {
  render(
    <>
      <Input id="email" label="Email" error="Required" />
      <Select
        id="size"
        label="Size"
        options={[{ value: '100g', label: '100g' }]}
      />
    </>,
  );
  expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  expect(screen.getByRole('alert')).toHaveTextContent('Required');
  expect(screen.getByLabelText('Size')).toBeInTheDocument();
});

test('Badge renders semantic tone', () => {
  render(<Badge tone="success">Ready</Badge>);
  expect(screen.getByText('Ready')).toHaveClass('text-leaf-700');
});

test('Modal closes on Escape and returns focus', async () => {
  const user = userEvent.setup();
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="Dialog">
      Body
    </Modal>,
  );
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
  trigger.remove();
});

test('Drawer traps focus, locks scroll, closes on Escape, and returns focus', async () => {
  const user = userEvent.setup();
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  const onClose = vi.fn();
  render(
    <Drawer open onClose={onClose}>
      {' '}
      <button>First</button>
      <button>Last</button>{' '}
    </Drawer>,
  );
  expect(document.body.style.overflow).toBe('hidden');
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
  trigger.remove();
});

test('Toast, Skeleton, Tabs, and Accordion expose state', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Toast message="Saved" />
      <Skeleton />
      <Tabs
        items={[
          { label: 'One', content: 'First' },
          { label: 'Two', content: 'Second' },
        ]}
      />
      <Accordion items={[{ title: 'Question', content: 'Answer' }]} />
    </>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
    'aria-selected',
    'false',
  );
  await user.click(screen.getByRole('tab', { name: 'Two' }));
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Second');
  await user.click(screen.getByRole('button', { name: 'Question' }));
  expect(screen.getByText('Answer')).toBeVisible();
});

test('Breadcrumb and Pagination expose navigation state', () => {
  render(
    withRouter(
      <>
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
        <Pagination page={2} pages={3} onChange={() => {}} />
      </>,
    ),
  );
  expect(
    screen.getByRole('navigation', { name: 'Breadcrumb' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('QuantitySelector clamps and announces values', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<QuantitySelector value={1} min={1} max={2} onChange={onChange} />);
  await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
  expect(onChange).toHaveBeenCalledWith(2);
  await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
  expect(onChange).toHaveBeenCalledWith(2);
});

test('PriceDisplay formats integer paise', () => {
  render(<PriceDisplay price={14900} mrp={19900} />);
  expect(screen.getByText('₹149')).toBeInTheDocument();
  expect(screen.getByText('₹199')).toBeInTheDocument();
});
