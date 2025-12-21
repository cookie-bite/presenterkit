# Refactor Login and Register Components

## Overview

Refactor both `Login.tsx` and `Register.tsx` to:

1. Use `Input` component from `@/ui` consistently
2. Move `Inputs` styled component from shared `auth/styled.ts` to each component's local `styled.ts`
3. Rename `Login.styled.ts` → `styled.ts` and `Register.styled.ts` → `styled.ts`

## Changes Required

### 1. Login Component (`frontend/src/app/auth/partials/Login/`)

- **Login.tsx**: Already uses `Input` from `@/ui` ✓, but needs to import `Inputs` from local `styled.ts` instead of `../../styled`
- **Login.styled.ts** → **styled.ts**: Add `Inputs` styled component (copy from `auth/styled.ts` lines 63-67)

### 2. Register Component (`frontend/src/app/auth/partials/Register/`)

- **Register.tsx**: 
  - Replace direct usage of `InputContainer`, `InputField`, `InputIcon` with `Input` component from `@/ui`
  - For the animated username field: Since `InputContainer` is a `motion.div` and needs animation props, we'll wrap `Input` in `AnimatePresence` and apply motion props to a wrapper, or use `InputContainer` directly (it's exported from ui) but build the input structure manually to match `Input` component behavior
  - Import `Inputs` from local `styled.ts` instead of `../../styled`
- **Register.styled.ts** → **styled.ts**: Add `Inputs` styled component (copy from `auth/styled.ts` lines 63-67)

### 3. Styled Component Definition

The `Inputs` component to be added to both local `styled.ts` files:

```typescript
export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
```

## Files to Modify

- `frontend/src/app/auth/partials/Login/Login.tsx` - Update import path for `Inputs`
- `frontend/src/app/auth/partials/Login/Login.styled.ts` → `frontend/src/app/auth/partials/Login/styled.ts` - Rename and add `Inputs` component
- `frontend/src/app/auth/partials/Register/Register.tsx` - Replace direct Input subcomponents with `Input` component, update import path
- `frontend/src/app/auth/partials/Register/Register.styled.ts` → `frontend/src/app/auth/partials/Register/styled.ts` - Rename and add `Inputs` component

## Note on Register Username Field Animation

The username field in Register uses framer-motion animation. Since `InputContainer` from ui is already a `motion.div`, we can:

- Option A: Use `InputContainer` directly with `InputField` and `InputIcon` (but this doesn't use the `Input` component)
- Option B: Wrap `Input` component in a motion wrapper div to apply animation props
- Option C: Check if we can pass motion props through to Input somehow

I'll use Option B (wrap Input in motion wrapper) to maintain consistency with using the `Input` component while preserving the animation.