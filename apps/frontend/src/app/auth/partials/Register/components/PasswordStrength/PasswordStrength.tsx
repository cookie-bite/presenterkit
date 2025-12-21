'use client';

import { passwordValidators } from '@/app/auth/schemas';
import { PasswordStrengthContainer, PasswordStrengthItem, Tooltip } from './styled';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  validator: (password: string) => boolean;
  tooltip: ((password: string) => string);
}

const requirements: Requirement[] = [
  {
    label: 'ab',
    validator: passwordValidators.lowercase,
    tooltip: () => 'Add lowercase letter',
  },
  {
    label: 'AB',
    validator: passwordValidators.uppercase,
    tooltip: () => 'Add uppercase letter',
  },
  {
    label: '12',
    validator: passwordValidators.digit,
    tooltip: () => 'Add digit',
  },
  {
    label: '@#',
    validator: passwordValidators.specialChar,
    tooltip: () => 'Add special character',
  },
  {
    label: '8+',
    validator: passwordValidators.length,
    tooltip: (password: string) => {
      const remaining = Math.max(0, 8 - password.length);
      return `Add minimum ${remaining} character${remaining === 1 ? '' : 's'}`;
    },
  },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) {
    return null;
  }

  return (
    <PasswordStrengthContainer
      initial={{ height: 0, marginBottom: 0, opacity: 0 }}
      animate={{ height: 25, marginBottom: 5, opacity: 1 }}
      exit={{ height: 0, marginBottom: 0, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
    >
      {requirements.map((req, index) => {
        const isValid = req.validator(password);
        const tooltip = req.tooltip(password);

        return (
          <PasswordStrengthItem key={index} $isValid={isValid}>
            <h4>{req.label}</h4>
            {!isValid && (
              <Tooltip>
                {tooltip}
              </Tooltip>
            )}
          </PasswordStrengthItem>
        );
      })}
    </PasswordStrengthContainer>
  );
}

