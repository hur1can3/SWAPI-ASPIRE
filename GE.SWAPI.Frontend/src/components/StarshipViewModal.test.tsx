import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils/render';
import { StarshipViewModal } from './StarshipViewModal';
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

describe('StarshipViewModal', () => {
  it('renders modal when opened is true', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('Starship Details')).toBeInTheDocument();
  });

  it('does not render modal content when opened is false', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={false} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.queryByText('Starship Details')).not.toBeInTheDocument();
  });

  it('displays all starship details', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Death Star')).toBeInTheDocument();
    expect(screen.getByText('Model:')).toBeInTheDocument();
    expect(screen.getByText('DS-1 Orbital Battle Station')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer:')).toBeInTheDocument();
    expect(screen.getByText('Imperial Department of Military Research')).toBeInTheDocument();
  });

  it('displays cost with credits suffix', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText(/1000000000000 credits/)).toBeInTheDocument();
  });

  it('displays length with meters suffix', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText(/120000 meters/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    const closeButton = screen.getByRole('button', { name: /Close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handles null starship gracefully', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={null} 
      />
    );

    expect(screen.getByText('Starship Details')).toBeInTheDocument();
    expect(screen.queryByText('Name:')).not.toBeInTheDocument();
  });

  it('displays all field labels correctly', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    const expectedLabels = [
      'Name:',
      'Model:',
      'Manufacturer:',
      'Cost In Credits:',
      'Length:',
      'Max Speed:',
      'Crew:',
      'Passengers:',
      'Cargo Capacity:',
      'Consumables:',
      'Hyperdrive Rating:',
      'MGLT:',
      'Class:',
    ];

    expectedLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('displays starship class correctly', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('Deep Space Mobile Battlestation')).toBeInTheDocument();
  });

  it('displays crew and passenger information', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('342953')).toBeInTheDocument();
    expect(screen.getByText('843342')).toBeInTheDocument();
  });

  it('displays consumables information', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('3 years')).toBeInTheDocument();
  });

  it('displays hyperdrive rating', () => {
    const onClose = vi.fn();
    render(
      <StarshipViewModal 
        opened={true} 
        onClose={onClose} 
        starship={mockStarship} 
      />
    );

    expect(screen.getByText('4.0')).toBeInTheDocument();
  });
});
