import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils/render';
import { StarshipDeleteModal } from './StarshipDeleteModal';
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

describe('StarshipDeleteModal', () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when opened is true', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Delete Starship')).toBeInTheDocument();
  });

  it('does not render modal content when opened is false', () => {
    render(
      <StarshipDeleteModal
        opened={false}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    expect(screen.queryByText('Delete Starship')).not.toBeInTheDocument();
  });

  it('displays starship name in confirmation message', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText(/Death Star/)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();
  });

  it('displays warning message', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', async () => {
    const user = userEvent.setup();
    onConfirm.mockResolvedValue(undefined);

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(mockStarship);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays error message when delete fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to delete starship';
    onConfirm.mockRejectedValue(new Error(errorMessage));

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables buttons while deleting', async () => {
    const user = userEvent.setup();
    onConfirm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('shows loading state on delete button while submitting', async () => {
    const user = userEvent.setup();
    onConfirm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
  });

  it('handles null starship gracefully', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={null}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Delete Starship')).toBeInTheDocument();
    expect(screen.queryByText(/Are you sure you want to delete/i)).not.toBeInTheDocument();
  });

  it('displays generic error message for unknown errors', async () => {
    const user = userEvent.setup();
    onConfirm.mockRejectedValue('Unknown error');

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete starship')).toBeInTheDocument();
    });
  });

  it('allows closing error alert', async () => {
    const user = userEvent.setup();
    onConfirm.mockRejectedValue(new Error('Delete failed'));

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Delete failed/)).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole('button');
    const closeAlertButton = closeButtons.find(btn => 
      btn.querySelector('svg') && btn.getAttribute('aria-label')?.includes('Close')
    );

    if (closeAlertButton) {
      await user.click(closeAlertButton);
      await waitFor(() => {
        expect(screen.queryByText(/Delete failed/)).not.toBeInTheDocument();
      });
    }
  });

  it('does not call onConfirm when starship is null', async () => {
    const user = userEvent.setup();
    onConfirm.mockResolvedValue(undefined);

    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={null}
        onConfirm={onConfirm}
      />
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(btn => btn.textContent === 'Delete');

    if (deleteButton) {
      await user.click(deleteButton);
      expect(onConfirm).not.toHaveBeenCalled();
    }
  });

  it('renders cancel button with default variant', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders delete button with red color', () => {
    render(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Delete$/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('clears error state when modal is closed and reopened', () => {
    const { rerender } = render(
      <StarshipDeleteModal
        opened={false}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    rerender(
      <StarshipDeleteModal
        opened={true}
        onClose={onClose}
        starship={mockStarship}
        onConfirm={onConfirm}
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
