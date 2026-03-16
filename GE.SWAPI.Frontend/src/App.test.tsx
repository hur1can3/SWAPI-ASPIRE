import { render } from '../test-utils';
import { describe, it, expect } from 'vitest';
import { Button } from '@mantine/core';

describe('Sample test', () => {
  it('should render a button with correct text', () => {
    const { container } = render(<Button>Test Button</Button>);
    expect(container.textContent).toContain('Test Button');
  });

  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
