export type ModifierKey = 'shift' | 'command' | 'control' | 'alt' | 'option' | 'meta';

export type RegularKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type ShortcutKey = ModifierKey | RegularKey;

export type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

export type ShortcutDisplayType = 'icon' | 'title';

export interface ShortcutProps {
  keys: ShortcutKey[];
  type?: ShortcutDisplayType;
}

export const getPlatform = (): Platform => {
  if (typeof window === 'undefined') {
    return 'mac'; // Default for SSR
  }

  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac';
  }
  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows';
  }
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }

  return 'unknown';
};

export const getKeyIcon = (key: ShortcutKey, platform: Platform): string => {
  switch (key) {
    case 'shift':
      return '⇧';
    case 'command':
      return platform === 'mac' ? '⌘' : 'Ctrl';
    case 'control':
      return '⌃';
    case 'alt':
      return '⌥';
    case 'option':
      return '⌥';
    case 'meta':
      return platform === 'mac' ? '⌘' : platform === 'windows' ? '⊞' : 'Meta';
    default:
      return key;
  }
};

export const getKeyTitle = (key: ShortcutKey, platform: Platform): string => {
  switch (key) {
    case 'shift':
      return 'Shift';
    case 'command':
      return platform === 'mac' ? 'Command' : 'Control';
    case 'control':
      return 'Control';
    case 'alt':
      return 'Alt';
    case 'option':
      return 'Option';
    case 'meta':
      return platform === 'mac' ? 'Meta' : platform === 'windows' ? 'Windows' : 'Meta';
    default:
      return key;
  }
};
