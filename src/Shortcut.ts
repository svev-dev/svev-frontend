import { Dispose } from './types';
import { isMac } from './utils/isMac';

export type Shortcut = {
  ctrlOrCommand?: boolean;
  altOrOption?: boolean;
  shift?: boolean;
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
   */
  code: string;
};

export function onShortcut(shortcut: Shortcut, callback: () => void): Dispose {
  const ctrlOrCommand = shortcut.ctrlOrCommand ?? false;
  const altOrOption = shortcut.altOrOption ?? false;
  const shift = shortcut.shift ?? false;
  const code = shortcut.code;

  const handler = (event: KeyboardEvent): void => {
    if (isMac() && event.metaKey !== ctrlOrCommand) return;
    if (!isMac() && event.ctrlKey !== ctrlOrCommand) return;
    if (event.altKey !== altOrOption) return;
    if (event.shiftKey !== shift) return;
    if (event.code !== code) return;

    event.preventDefault();
    callback();
  };

  document.addEventListener('keydown', handler);
  return () => {
    document.removeEventListener('keydown', handler);
  };
}

/**
 * Returns a human-readable string representation of a shortcut.
 * OS-sensitive: uses "Cmd" on Mac, "Ctrl" on other platforms.
 */
export function shortcutToStringParts(shortcut: Shortcut): string[] {
  const parts: string[] = [];
  const mac = isMac();

  if (shortcut.ctrlOrCommand === true) {
    parts.push(mac ? '⌘' : 'Ctrl');
  }
  if (shortcut.altOrOption === true) {
    parts.push(mac ? '⌥' : 'Alt');
  }
  if (shortcut.shift === true) {
    parts.push('⇧');
  }

  const keyName = codeToKeyName(shortcut.code);
  parts.push(keyName);

  return parts;
}

/**
 * Converts a key code to a human-readable key name.
 */
function codeToKeyName(code: string): string {
  // Handle letter keys (KeyA -> A)
  if (code.startsWith('Key')) {
    return code.slice(3);
  }
  // Handle digit keys (Digit1 -> 1)
  if (code.startsWith('Digit')) {
    return code.slice(5);
  }
  // Handle function keys (F1 -> F1)
  if (code.startsWith('F') && /^F\d+$/.test(code)) {
    return code;
  }
  // Handle special keys
  const specialKeys: Record<string, string> = {
    Space: 'Space',
    Enter: 'Enter',
    Escape: 'Esc',
    Tab: 'Tab',
    Backspace: 'Backspace',
    Delete: 'Delete',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Home: 'Home',
    End: 'End',
    PageUp: 'Page Up',
    PageDown: 'Page Down',
    Insert: 'Insert',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Semicolon: ';',
    Quote: "'",
    Comma: ',',
    Period: '.',
    Slash: '/',
    Backquote: '`',
  };
  return specialKeys[code] ?? code;
}
