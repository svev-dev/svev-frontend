import { Shortcut } from '../Shortcut';
import { Property } from './Property';

export interface IPropertyRegister {
  addHeader(name: string): void;
  addBool(name: string, property: Property<boolean, unknown>): void;
  addString(name: string, property: Property<string, unknown>): void;
  addOptions(
    name: string,
    property: Property<string | number, unknown>,
    options: readonly string[] | readonly number[]
  ): void;
  addOptionalOptions(
    name: string,
    property: Property<string | number | undefined, unknown>,
    options: readonly string[] | readonly number[]
  ): void;
  addOptionalIcon(name: string, property: Property<SVGElement | undefined, unknown>): void;
  addOptionalShortcut(name: string, property: Property<Shortcut | undefined, unknown>): void;
}
