import { render } from '../../test-utils';
import { describe, it, expect, vi } from 'vitest';
import { Button, Stack, TextInput } from '@mantine/core';

// Example: Testing Mantine components
describe('Mantine Components Examples', () => {
  it('should render a button with Mantine styles', () => {
    const { getByRole } = render(<Button color="blue">Click Me</Button>);
    const button = getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
  });

  it('should handle button click events', async () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click Me</Button>
    );
    
    const button = getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render a form with text input', () => {
    const { getByLabelText } = render(
      <Stack>
        <TextInput label="Username" placeholder="Enter username" />
        <Button type="submit">Submit</Button>
      </Stack>
    );
    
    const input = getByLabelText('Username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter username');
  });

  it('should handle disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);
    const button = getByRole('button');
    
    expect(button).toBeDisabled();
  });
});
