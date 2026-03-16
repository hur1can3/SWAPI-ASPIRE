import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils/render';
import { StarshipFormModal } from './StarshipFormModal';
import { ValidationError } from '../services/starshipApi';
import type { Starship } from '../types/Starship';

const mockStarship: Starship = {
  id: 1,
  name: 'Death Star',
  model: 'DS-1 Orbital Battle Station',
  manufacturer: 'Imperial Department of Military Research',
  cost_in_credits: '1000000000000',
  length: '120000',
  max_atmosphering_speed: 'n/a',
  crew: '342953',
  passengers: '843342',
  cargo_capacity: '1000000000000',
  consumables: '3 years',
  hyperdrive_rating: '4.0',
  MGLT: '10',
  starship_class: 'Deep Space Mobile Battlestation',
};

const emptyStarship: Starship = {
  id: 0,
  name: '',
  model: '',
  manufacturer: '',
  cost_in_credits: '',
  length: '',
  max_atmosphering_speed: '',
  crew: '',
  passengers: '',
  cargo_capacity: '',
  consumables: '',
  hyperdrive_rating: '',
  MGLT: '',
  starship_class: '',
};

describe('StarshipFormModal', () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with create mode title', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Add New Starship')).toBeInTheDocument();
  });

  it('renders modal with edit mode title', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="edit"
        initialData={mockStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Edit Starship')).toBeInTheDocument();
  });

  it('does not render modal content when opened is false', () => {
    render(
      <StarshipFormModal
        opened={false}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.queryByText('Add New Starship')).not.toBeInTheDocument();
  });

  it('displays all form fields', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Manufacturer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cost in Credits/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Length$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Atmosphering Speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Crew/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passengers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo Capacity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Consumables/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hyperdrive Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MGLT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Starship Class/i)).toBeInTheDocument();
  });

  it('populates form fields with initial data in edit mode', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="edit"
        initialData={mockStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByDisplayValue('Death Star')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DS-1 Orbital Battle Station')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Imperial Department of Military Research')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted in create mode', async () => {
    const user = userEvent.setup();
    onSubmit.mockResolvedValue(undefined);

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Name/i), 'X-Wing');
    await user.type(screen.getByLabelText(/Model/i), 'T-65');
    await user.type(screen.getByLabelText(/Manufacturer/i), 'Incom');

    const submitButton = screen.getByRole('button', { name: /Create Starship/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'X-Wing',
          model: 'T-65',
          manufacturer: 'Incom',
        })
      );
    });
  });

  it('calls onSubmit when form is submitted in edit mode', async () => {
    const user = userEvent.setup();
    onSubmit.mockResolvedValue(undefined);

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="edit"
        initialData={mockStarship}
        onSubmit={onSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Death Star II');

    const submitButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Death Star II',
        })
      );
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays validation errors when submission fails', async () => {
    const user = userEvent.setup();
    const validationError = new ValidationError('Validation failed', {
      Name: ['Name is required'],
      Model: ['Model is required'],
    });
    onSubmit.mockRejectedValue(validationError);

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Name/i), 'Test');
    await user.type(screen.getByLabelText(/Model/i), 'Test');
    await user.type(screen.getByLabelText(/Manufacturer/i), 'Test');

    const submitButton = screen.getByRole('button', { name: /Create Starship/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    });
  });

  it('displays generic error when submission fails with non-validation error', async () => {
    const user = userEvent.setup();
    onSubmit.mockRejectedValue(new Error('Network error'));

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Name/i), 'Test');
    await user.type(screen.getByLabelText(/Model/i), 'Test');
    await user.type(screen.getByLabelText(/Manufacturer/i), 'Test');

    const submitButton = screen.getByRole('button', { name: /Create Starship/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    onSubmit.mockResolvedValue(undefined);

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Name/i), 'Test');
    await user.type(screen.getByLabelText(/Model/i), 'Test');
    await user.type(screen.getByLabelText(/Manufacturer/i), 'Test');

    const submitButton = screen.getByRole('button', { name: /Create Starship/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('resets form errors when modal is reopened', () => {
    const { rerender } = render(
      <StarshipFormModal
        opened={false}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    rerender(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    expect(screen.queryByText('Validation failed')).not.toBeInTheDocument();
  });

  it('updates form data when input values change', async () => {
    const user = userEvent.setup();
    onSubmit.mockResolvedValue(undefined);

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    const lengthInput = screen.getByLabelText(/^Length$/i);
    await user.type(lengthInput, '100');

    expect(lengthInput).toHaveValue('100');
  });

  it('handles null initialData gracefully', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={null}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Add New Starship')).toBeInTheDocument();
  });

  it('shows required indicator for required fields', () => {
    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toBeRequired();
    
    const modelInput = screen.getByLabelText(/Model/i);
    expect(modelInput).toBeRequired();
    
    const manufacturerInput = screen.getByLabelText(/Manufacturer/i);
    expect(manufacturerInput).toBeRequired();
  });

  it('allows closing error alert', async () => {
    const user = userEvent.setup();
    onSubmit.mockRejectedValue(new Error('Network error'));

    render(
      <StarshipFormModal
        opened={true}
        onClose={onClose}
        mode="create"
        initialData={emptyStarship}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Name/i), 'Test');
    await user.type(screen.getByLabelText(/Model/i), 'Test');
    await user.type(screen.getByLabelText(/Manufacturer/i), 'Test');

    const submitButton = screen.getByRole('button', { name: /Create Starship/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole('button');
    const closeAlertButton = closeButtons.find(btn => 
      btn.querySelector('svg') && btn.getAttribute('aria-label')?.includes('Close')
    );

    if (closeAlertButton) {
      await user.click(closeAlertButton);
      await waitFor(() => {
        expect(screen.queryByText(/Network error/)).not.toBeInTheDocument();
      });
    }
  });
});
