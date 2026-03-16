import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils/render';
import App from './App';
import * as starshipApi from './services/starshipApi';
import type { PagedResult, Starship } from './types/Starship';

vi.mock('./services/starshipApi');

const mockStarships: Starship[] = [
  {
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
  },
  {
    id: 2,
    name: 'Millennium Falcon',
    model: 'YT-1300 light freighter',
    manufacturer: 'Corellian Engineering Corporation',
    cost_in_credits: '100000',
    length: '34.37',
    max_atmosphering_speed: '1050',
    crew: '4',
    passengers: '6',
    cargo_capacity: '100000',
    consumables: '2 months',
    hyperdrive_rating: '0.5',
    MGLT: '75',
    starship_class: 'Light freighter',
  },
];

const mockPagedResult: PagedResult<Starship> = {
  data: mockStarships,
  totalRecords: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(starshipApi.fetchStarships).mockResolvedValue(mockPagedResult);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app title', async () => {
    render(<App />);
    expect(screen.getByText('SW API Starships')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search starships...')).toBeInTheDocument();
  });

  it('renders the add new starship button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Add New Starship/i })).toBeInTheDocument();
  });

  it('fetches and displays starships on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(starshipApi.fetchStarships).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        sortColumn: 'name',
        sortDirection: 'asc',
        searchTerm: '',
      });
    });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch starship data';
    vi.mocked(starshipApi.fetchStarships).mockRejectedValue(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('opens create modal when add new button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = screen.getByRole('button', { name: /Add New Starship/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Starship')).toBeInTheDocument();
    });
  });

  it('searches starships when search term is entered', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(starshipApi.fetchStarships).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText('Search starships...');
    await user.type(searchInput, 'Falcon');

    await waitFor(() => {
      expect(starshipApi.fetchStarships).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'Falcon',
          page: 1,
        })
      );
    }, { timeout: 1000 });
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search starships...');
    await user.type(searchInput, 'Falcon');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /Clear/i });
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  it('fetches data on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(starshipApi.fetchStarships).toHaveBeenCalled();
    });
  });

  it('shows error and allows closing the error alert', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network error';
    vi.mocked(starshipApi.fetchStarships).mockRejectedValue(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole('button');
    const closeAlertButton = closeButtons.find(btn => 
      btn.querySelector('svg') && btn.getAttribute('aria-label')?.includes('Close')
    );

    if (closeAlertButton) {
      await user.click(closeAlertButton);
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    }
  });
});
