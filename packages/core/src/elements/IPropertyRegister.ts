import type { Shortcut } from '../Shortcut';
import type { Property } from './Property';

export interface IPropertyRegister {
  addHeader(name: string): void;
  addBool(name: string, property: Property<boolean, unknown>): void;

  addString(name: string, property: Property<string, unknown>): void;
  addOptionalString(name: string, property: Property<string | undefined, unknown>): void;

  addOptions<T extends string | number>(
    name: string,
    property: Property<T, unknown>,
    options: readonly T[]
  ): void;
  addOptionalOptions<T extends string | number>(
    name: string,
    property: Property<T | undefined, unknown>,
    options: readonly T[]
  ): void;

  addOptionalIcon(name: string, property: Property<SVGElement | undefined, unknown>): void;
  addOptionalShortcut(name: string, property: Property<Shortcut | undefined, unknown>): void;
}
