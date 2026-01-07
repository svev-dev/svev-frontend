import {
  BoolInput,
  Flex,
  StringInput,
  UIElement,
  IPropertyRegister,
  Property,
  Shortcut,
  SelectInput,
  Text,
  createSVGElement,
} from 'svev-frontend';
import BookmarkIcon from './icons/Bookmark.svg?raw';
import ClipboardIcon from './icons/Clipboard.svg?raw';

export class Styling extends UIElement implements IPropertyRegister {
  readonly #elements: UIElement[] = [];

  public createUI(): ChildNode {
    const layout = this.createElement(() =>
      new Flex(this.#elements).direction('column').gap('10px')
    );
    return layout.createUI();
  }

  public addHeader(name: string): void {
    const header = new Text().text(name).bold(true);
    this.#elements.push(header);
  }

  public addBool(name: string, property: Property<boolean, unknown>): void {
    const checkbox = new BoolInput().label(name).isChecked(property());
    this.effect(() => {
      property(checkbox.isChecked());
    });
    this.#elements.push(checkbox);
  }

  public addString(name: string, property: Property<string, unknown>): void {
    const stringInput = new StringInput().value(property()).placeholder(name);
    this.effect(() => {
      property(stringInput.value());
    });
    this.#elements.push(stringInput);
  }

  public addOptions<T extends string | number>(
    name: string,
    property: Property<T, unknown>,
    options: readonly T[]
  ): void {
    const select = new SelectInput<T>().placeholder(name).value(property()).setOptions(options);
    this.effect(() => {
      property(select.requiredValue());
    });
    this.#elements.push(select);
  }

  public addOptionalOptions<T extends string | number>(
    name: string,
    property: Property<T | undefined, unknown>,
    options: readonly T[]
  ): void {
    const initialValue = property();
    const text = this.createElement(() => new Text().text(name));
    const activeCheckbox = new BoolInput().isChecked(initialValue !== undefined);
    const select = new SelectInput<T>().setOptions(options).value(initialValue);
    this.effect(() => {
      const isEnabled = activeCheckbox.isChecked();
      select.isEnabled(isEnabled);
      if (isEnabled) {
        property(select.requiredValue());
      } else {
        property(undefined);
      }
    });
    const layout = this.createElement(() =>
      new Flex([text, activeCheckbox, select]).direction('row').gap('8px').alignItems('center')
    );
    this.#elements.push(layout);
  }

  public addOptionalIcon(name: string, property: Property<SVGElement | undefined, unknown>): void {
    const icons = {
      Bookmark: createSVGElement(BookmarkIcon),
      Clipboard: createSVGElement(ClipboardIcon),
    } as const satisfies Record<string, SVGElement>;

    // We set property to `undefined` as we don't have the SVG element in our example.
    property(undefined);

    type IconKey = keyof typeof icons;
    const Keys = Object.keys(icons) as IconKey[];
    const initialValue = property();
    const text = this.createElement(() => new Text().text(name));
    const activeCheckbox = new BoolInput().isChecked(initialValue !== undefined);
    const select = new SelectInput<IconKey>().setOptions(Keys);
    this.effect(() => {
      const isEnabled = activeCheckbox.isChecked();
      select.isEnabled(isEnabled);
      if (isEnabled) {
        property(icons[select.requiredValue()]);
      } else {
        property(undefined);
      }
    });
    const layout = this.createElement(() =>
      new Flex([text, activeCheckbox, select]).direction('row').gap('8px').alignItems('center')
    );
    this.#elements.push(layout);
  }

  public addOptionalShortcut(
    _name: string,
    _property: Property<Shortcut | undefined, unknown>
  ): void {
    // Not implemented yet
  }
}
