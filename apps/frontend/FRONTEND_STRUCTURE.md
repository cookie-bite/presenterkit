# Frontend Structure Documentation

This document provides a comprehensive overview of the frontend codebase structure, conventions, and specificities for developers working on the PresenterKit frontend.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Component Organization](#component-organization)
- [Styling System](#styling-system)
- [API Client](#api-client)
- [State Management](#state-management)
- [Form Handling](#form-handling)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [Key Conventions](#key-conventions)

---

## Technology Stack

### Core Framework
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Styled Components 6.1.19** - CSS-in-JS styling
- **Framer Motion 12.23.24** - Animation library

### State Management & Data Fetching
- **TanStack Query (React Query) 5.90.11** - Server state management
- **React Hook Form 7.67.0** - Form state management
- **Zod 4.1.13** - Schema validation

### HTTP Client
- **Ky 1.14.0** - HTTP client with interceptors
- **JWT Decode 4.0.0** - Token decoding
- **js-cookie 3.0.5** - Cookie management

### Development Tools
- **Storybook 9.1.5** - Component development and documentation
- **Vitest 3.2.4** - Unit testing framework
- **ESLint 9.39.1** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Playwright 1.55.0** - E2E testing (via Vitest browser mode)

---

## Project Structure

```
frontend/
├── .next/                    # Next.js build output (gitignored)
├── .storybook/               # Storybook configuration
│   ├── main.ts              # Storybook main config
│   ├── preview.ts           # Storybook preview config
│   └── vitest.setup.ts      # Vitest setup for Storybook tests
├── node_modules/            # Dependencies (gitignored)
├── public/                  # Static assets
│   ├── fonts/               # Custom fonts (InterVariable.woff2)
│   ├── icons/               # SVG icons (922 files)
│   ├── images/              # Image assets
│   └── videos/              # Video assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── auth/            # Authentication pages
│   │   │   ├── page.tsx     # Auth page entry
│   │   │   ├── schemas.ts   # Zod validation schemas
│   │   │   ├── styled.ts    # Page-level styles
│   │   │   └── partials/    # Auth sub-components
│   │   │       ├── Login/
│   │   │       ├── Register/
│   │   │       └── OTPVerification/
│   │   ├── dashboard/       # Dashboard pages
│   │   │   ├── layout.tsx   # Dashboard layout
│   │   │   ├── page.tsx     # Dashboard page
│   │   │   ├── styled.ts    # Dashboard styles
│   │   │   └── partials/    # Dashboard sub-components
│   │   │       ├── Displays/
│   │   │       ├── Files/
│   │   │       ├── Menu/
│   │   │       └── Stage/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── providers.tsx    # Client-side providers
│   │   └── styled.ts        # Global app styles
│   ├── lib/                 # Shared utilities and libraries
│   │   ├── api/             # API client and utilities
│   │   │   ├── client.ts    # Ky HTTP client with interceptors
│   │   │   ├── auth.api.ts  # Auth API endpoints
│   │   │   ├── token-storage.ts  # Token management
│   │   │   └── types.ts     # API type definitions
│   │   └── hooks/           # Custom React hooks
│   │       └── useAuth.ts   # Authentication hook
│   ├── stories/             # Storybook example stories
│   └── ui/                  # Reusable UI components
│       ├── components/      # UI component library
│       │   ├── Button/
│       │   ├── Icon/
│       │   ├── Input/
│       │   ├── Panel/
│       │   └── ...
│       ├── theme/           # Theme system
│       │   ├── colors.ts    # Color definitions
│       │   ├── text.ts      # Typography definitions
│       │   ├── radius.ts    # Border radius definitions
│       │   ├── breakpoints.ts  # Responsive breakpoints
│       │   ├── global.ts    # Global styles
│       │   ├── ThemeProvider.tsx  # Theme context provider
│       │   └── styled.d.ts  # TypeScript theme types
│       └── index.ts         # UI library exports
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── prettier.config.js      # Prettier configuration
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest test configuration
```

---

## Architecture Patterns

### App Router Structure

The project uses Next.js 15 App Router with the following patterns:

- **Server Components by Default**: Pages are server components unless marked with `'use client'`
- **Client Components**: Components that use hooks, state, or browser APIs are marked with `'use client'`
- **Layouts**: Nested layouts for route groups (e.g., `dashboard/layout.tsx`)
- **Partials Pattern**: Page-specific components are organized in `partials/` folders

### Component Organization

#### Page Components (`app/`)
- Entry points for routes
- Minimal logic, mostly composition
- Can be server or client components

#### Partial Components (`app/*/partials/`)
- Page-specific components
- Organized by feature/domain
- Each partial has its own folder with:
  - `ComponentName.tsx` - Main component
  - `styled.ts` - Styled components
  - `index.ts` - Barrel export

#### UI Components (`src/ui/components/`)
- Reusable, generic components
- Follow a consistent structure:
  ```
  ComponentName/
  ├── ComponentName.tsx       # Component implementation
  ├── ComponentName.styled.ts # Styled components
  ├── ComponentName.types.ts  # TypeScript types
  └── index.ts               # Barrel export
  ```

---

## Component Organization

### UI Component Structure

Each UI component follows this pattern:

```typescript
// ComponentName.tsx
'use client'; // If needed

import { StyledComponent } from './ComponentName.styled';
import type { ComponentProps } from './ComponentName.types';

export function ComponentName({ ...props }: ComponentProps) {
  // Component logic
  return <StyledComponent {...props} />;
}
```

```typescript
// ComponentName.types.ts
import type { HTMLAttributes } from 'react';

export interface ComponentProps extends HTMLAttributes<HTMLElement> {
  // Component-specific props
}
```

```typescript
// ComponentName.styled.ts
import styled from 'styled-components';

export const StyledComponent = styled.div`
  // Styles using theme
  color: ${({ theme }) => theme.colors.text.primary};
`;
```

```typescript
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentProps } from './ComponentName.types';
```

### Partial Component Structure

Page-specific components follow a simpler pattern:

```typescript
// ComponentName.tsx
import { StyledElement } from './styled';

export const ComponentName = () => {
  return <StyledElement>...</StyledElement>;
};
```

```typescript
// styled.ts
import styled from 'styled-components';

export const StyledElement = styled.div`
  // Styles
`;
```

```typescript
// index.ts
export { ComponentName } from './ComponentName';
```

---

## Styling System

### Theme Provider

The app uses a centralized theme system via Styled Components:

- **Theme Provider**: Wraps the app in `app/layout.tsx`
- **Theme Context**: Provides `mode` (dark/light) and `setMode` function
- **Theme Hook**: `useTheme()` for accessing theme in components

### Theme Structure

```typescript
theme = {
  colors: {
    // Color tokens organized by mode
  },
  mode: 'dark' | 'light',
  radius: {
    // Border radius tokens
  },
  text: {
    // Typography tokens
  }
}
```

### Styled Components Usage

- All styles use Styled Components
- Theme access via `theme` prop: `${({ theme }) => theme.colors.primary}`
- TypeScript theme types in `ui/theme/styled.d.ts`
- Global styles in `ui/theme/global.ts`

### SVG Icons

- SVG files are imported as React components via `@svgr/webpack`
- Configured in `next.config.ts`
- Icons located in `public/icons/` (922 SVG files)
- Icon component wrapper in `ui/components/Icon/`

---

## API Client

### HTTP Client Setup

The project uses **Ky** as the HTTP client with automatic token management:

**Location**: `src/lib/api/client.ts`

**Features**:
- Automatic access token refresh
- Request queue to prevent concurrent refresh calls
- Token expiration detection
- Automatic token attachment to requests
- Error handling and token cleanup on 401

**Configuration**:
- Base URL from `NEXT_PUBLIC_API_URL` environment variable
- 20-second timeout
- JSON content type by default

### Token Management

**Location**: `src/lib/api/token-storage.ts`

- Access tokens stored in memory
- Refresh tokens stored in HTTP-only cookies
- Automatic token refresh before expiration
- Token cleanup on authentication failures

### API Endpoints

API functions are organized by domain:
- `auth.api.ts` - Authentication endpoints
- Additional API files can be added as needed

### Usage Example

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const data = await apiClient.get('endpoint').json();

// POST request
const result = await apiClient.post('endpoint', { json: { ... } }).json();
```

---

## State Management

### Server State (TanStack Query)

- **Query Client**: Configured in `app/providers.tsx`
- **Default Options**:
  - `staleTime`: 5 minutes
  - `gcTime`: 10 minutes (formerly cacheTime)
  - `retry`: 1 attempt
- Used for all server data fetching

### Form State (React Hook Form)

- Forms use React Hook Form for state management
- Validation via Zod schemas
- Resolvers: `@hookform/resolvers` with Zod

### Local State

- React `useState` for component-local state
- Theme state in `ThemeProvider` context

---

## Form Handling

### Validation Schemas

**Location**: `app/auth/schemas.ts`

- All form schemas use **Zod**
- Schemas defined per form (login, register, OTP verification)
- Type inference: `z.infer<typeof schema>`

### Form Patterns

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from './schemas';

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### Password Validation

- Real-time validation helpers in `schemas.ts`
- Password strength component in `Register/PasswordStrength/`
- Regex matching backend requirements

---

## Testing

### Test Framework

- **Vitest** for unit and integration tests
- **Storybook** for component development and visual testing
- **Playwright** (via Vitest browser mode) for browser-based tests

### Test Configuration

**Location**: `vitest.config.ts`

- Storybook integration via `@storybook/addon-vitest`
- Browser mode enabled with Playwright
- Setup file: `.storybook/vitest.setup.ts`

### Storybook

- Component stories in `src/stories/` (examples)
- Stories can be added alongside components
- Accessible at `http://localhost:6006` during development
- Addons: a11y, docs, onboarding, vitest

### Running Tests

```bash
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook
# Tests run via Storybook addon
```

---

## Development Workflow

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint and fix code
npm run lint:check       # Check linting (no fix)
npm run format           # Format code with Prettier
npm run format:check     # Check formatting (no fix)
npm run check            # Run both lint and format checks
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook
```

### Code Quality

- **ESLint**: Configured with TypeScript, Next.js, and import sorting
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Import Sorting**: Automatic via `eslint-plugin-simple-import-sort`

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:3000`)

---

## Key Conventions

### File Naming

- **Components**: PascalCase (`Button.tsx`, `LoginForm.tsx`)
- **Utilities**: camelCase (`token-storage.ts`, `useAuth.ts`)
- **Types**: PascalCase with `.types.ts` suffix (`Button.types.ts`)
- **Styled Components**: `styled.ts` or `ComponentName.styled.ts`
- **Barrel Exports**: `index.ts` in component folders

### Import Organization

Imports are automatically sorted by ESLint:
1. External dependencies
2. Internal imports (using `@/` alias)
3. Relative imports
4. Type imports (separated)

### TypeScript

- **Strict Mode**: Enabled
- **Path Alias**: `@/*` maps to `./src/*`
- **Type Definitions**: Separate `.types.ts` files for complex types
- **Type Inference**: Prefer `z.infer` for Zod schemas

### Component Patterns

1. **Client Components**: Mark with `'use client'` directive
2. **Server Components**: Default, no directive needed
3. **Styled Components**: Separate from logic in `styled.ts` files
4. **Barrel Exports**: Use `index.ts` for clean imports
5. **Type Exports**: Export types alongside components

### Styling Conventions

- Use theme tokens instead of hardcoded values
- Access theme via `theme` prop in styled components
- Global styles in `ui/theme/global.ts`
- Page-specific styles in `styled.ts` files

### API Patterns

- Use `apiClient` from `@/lib/api/client`
- API functions in domain-specific files (e.g., `auth.api.ts`)
- Token management is automatic
- Error handling via Ky hooks

### Folder Organization

- **Pages**: `app/` directory (Next.js App Router)
- **Partials**: `app/*/partials/` for page-specific components
- **UI Components**: `src/ui/components/` for reusable components
- **Utilities**: `src/lib/` for shared code
- **Assets**: `public/` for static files

---

## Additional Notes

### SVG Handling

- SVGs are imported as React components via `@svgr/webpack`
- Configured in `next.config.ts`
- Icons stored in `public/icons/`

### Fonts

- Custom fonts in `public/fonts/`
- Next.js font optimization via `next/font/google` (Geist fonts)
- Font variables in root layout

### Responsive Design

- Breakpoints defined in `ui/theme/breakpoints.ts`
- Use theme breakpoints in styled components
- Responsive utilities available via theme

### Accessibility

- Storybook a11y addon for accessibility testing
- Semantic HTML encouraged
- ARIA attributes where needed

---

## Getting Started for New Developers

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create `.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Storybook** (optional):
   ```bash
   npm run storybook
   ```

5. **Run Code Quality Checks**:
   ```bash
   npm run check
   ```

### Recommended Workflow

1. Create component in appropriate location (`ui/components/` or `app/*/partials/`)
2. Follow component structure conventions
3. Add types in `.types.ts` file
4. Style with Styled Components using theme
5. Export via `index.ts`
6. Add Storybook story if it's a UI component
7. Run linting and formatting before committing

---

## Questions or Issues?

For questions about the frontend structure, conventions, or patterns, refer to:
- This documentation
- Existing component examples
- Storybook stories
- TypeScript types and interfaces

