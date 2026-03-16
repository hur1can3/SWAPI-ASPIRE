# Vitest Setup

This project now includes [Vitest](https://vitest.dev/) for unit testing, configured following the [Mantine vite template](https://github.com/mantinedev/vite-template).

## What was added

### Dependencies

The following test-related dependencies were added:
- `vitest` - Test framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `@testing-library/dom` - DOM testing utilities
- `jsdom` - JavaScript implementation of DOM for Node.js
- `@vitest/browser` - Browser-mode testing support

### Configuration Files

1. **vitest.setup.mjs** - Test setup file that:
   - Imports jest-dom matchers
   - Mocks `window.matchMedia` for Mantine components
   - Mocks `ResizeObserver` for compatibility

2. **vite.config.ts** - Updated to include vitest configuration:
   ```typescript
   test: {
     globals: true,
     environment: 'jsdom',
     setupFiles: './vitest.setup.mjs',
   }
   ```

3. **tsconfig.vitest.json** - TypeScript configuration for test files

4. **test-utils/** - Custom test utilities:
   - `render.tsx` - Wraps Testing Library's render with MantineProvider
   - `index.ts` - Exports test utilities

## Available Scripts

### Run tests once
```bash
npm run vitest
```

### Run tests in watch mode
```bash
npm run vitest:watch
```

### Run full test suite (tests + typecheck + lint)
```bash
npm test
```

### Type checking only
```bash
npm run typecheck
```

## Writing Tests

Tests should be placed next to the component they test with a `.test.tsx` or `.test.ts` extension.

### Example Test

```typescript
import { render } from '../test-utils';
import { describe, it, expect } from 'vitest';
import { Button } from '@mantine/core';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeInTheDocument();
  });

  it('should handle button click', async () => {
    const { getByRole } = render(<MyComponent />);
    const button = getByRole('button');
    
    // Your assertions here
    expect(button).toHaveTextContent('Click me');
  });
});
```

### Using the Custom Render

Always use the custom `render` function from `test-utils` instead of importing directly from `@testing-library/react`. This ensures your components are wrapped with the necessary providers (MantineProvider, theme, etc.).

```typescript
import { render } from '../test-utils';  // ✅ Correct
// import { render } from '@testing-library/react';  // ❌ Don't do this
```

## Troubleshooting

If you encounter issues with:

- **matchMedia errors**: These are handled by the setup file
- **ResizeObserver errors**: These are handled by the setup file
- **Module resolution**: Make sure `tsconfig.vitest.json` includes your test files

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Mantine Testing Guide](https://mantine.dev/guides/testing/)
