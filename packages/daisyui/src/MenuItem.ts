import { IS_DEV, signal, UIElement } from 'svev-frontend';
import type { Menu } from './Menu';
import type { Element, IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/menu/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// menu-title
// menu-active menu-disabled menu-focus
// menu-dropdown menu-dropdown-toggle menu-dropdown-show

export class MenuItem extends UIElement {
  public readonly label = this.prop('');
  public readonly href = this.prop<string | undefined>(undefined);
  public readonly icon = this.prop<SVGElement | undefined>(undefined);
  public readonly isTitle = this.prop(false);
  public readonly isActive = this.prop(false);
  public readonly isFocused = this.prop(false);
  readonly #submenu = signal<Menu | undefined>(undefined);

  protected createUI(): Element {
    const li = document.createElement('li');
    let anchor: HTMLAnchorElement | undefined;
    let titleHeading: HTMLHeadingElement | undefined;

    this.effect(() => {
      const isTitle = this.isTitle();
      const submenu = this.#submenu();

      if (isTitle) {
        this.#updateTitleItem(li, anchor, submenu);
        if (submenu) {
          // For titles with submenu, create h2 element with menu-title class
          titleHeading = this.#getOrCreateTitleHeading(li, titleHeading);
          titleHeading.textContent = this.label();
        } else if (titleHeading) {
          // Remove h2 if switching from submenu to no submenu
          titleHeading.remove();
          titleHeading = undefined;
        }
        anchor = undefined;
      } else {
        // Remove titleHeading if it exists (switching from title to regular item)
        if (titleHeading) {
          titleHeading.remove();
          titleHeading = undefined;
        }
        // Remove menu-title class when switching from title to regular item
        if (li.className === 'menu-title') {
          li.className = '';
        }
        anchor = this.#getOrCreateAnchor(li, anchor);
        this.#updateRegularItem(li, anchor);
      }

      if (submenu) {
        const dispose = submenu.render({ in: li });
        return dispose;
      }

      return (): void => {};
    });

    return li;
  }

  /**
   * Gets or creates an h2 heading element for menu titles with submenus.
   * @param li - The list item element to append the heading to
   * @param existing - An existing heading element to reuse, if any
   * @returns The heading element (either existing or newly created)
   */
  #getOrCreateTitleHeading(
    li: HTMLLIElement,
    existing: HTMLHeadingElement | undefined
  ): HTMLHeadingElement {
    if (existing) return existing;
    const heading = document.createElement('h2');
    heading.className = 'menu-title';
    li.appendChild(heading);
    return heading;
  }

  /**
   * Gets or creates an anchor element for regular menu items.
   * @param li - The list item element to append the anchor to
   * @param existing - An existing anchor element to reuse, if any
   * @returns The anchor element (either existing or newly created)
   */
  #getOrCreateAnchor(
    li: HTMLLIElement,
    existing: HTMLAnchorElement | undefined
  ): HTMLAnchorElement {
    if (existing) return existing;
    const anchor = document.createElement('a');
    li.appendChild(anchor);
    return anchor;
  }

  /**
   * Updates a title menu item, handling both simple titles and titles with submenus.
   * @param li - The list item element to update
   * @param anchor - The anchor element to remove if it exists (titles don't use anchors)
   * @param submenu - The submenu instance, if any
   */
  #updateTitleItem(
    li: HTMLLIElement,
    anchor: HTMLAnchorElement | undefined,
    submenu: Menu | undefined
  ): void {
    const label = this.label();

    // Remove anchor if it exists
    if (anchor) {
      anchor.remove();
    }

    if (!submenu) {
      // For titles without submenu, add menu-title class to the li element
      li.className = 'menu-title';
      li.textContent = label;
    } else {
      // For titles with submenu, the h2 element will have the menu-title class
      // The li should not have the class or textContent (text goes in h2)
      li.className = '';
      li.textContent = '';
    }
  }

  /**
   * Updates a regular menu item, setting its content, href, disabled state, and CSS classes.
   * @param li - The list item element to update
   * @param anchor - The anchor element to update (must exist)
   */
  #updateRegularItem(li: HTMLLIElement, anchor: HTMLAnchorElement | undefined): void {
    if (!anchor) return;

    const label = this.label();
    const href = this.href();
    const icon = this.icon();
    const isDisabled = !this.isEnabled();
    const classNames: string[] = [];

    // Update anchor content
    anchor.textContent = '';
    if (icon !== undefined) {
      anchor.appendChild(icon);
    }
    if (label) {
      anchor.appendChild(document.createTextNode(label));
    }

    // Handle href and disabled state
    if (isDisabled || href === undefined || href === '') {
      anchor.removeAttribute('href');
      anchor.setAttribute('role', 'link');
      anchor.setAttribute('aria-disabled', 'true');
      classNames.push('menu-disabled');
    } else {
      anchor.href = href;
      anchor.removeAttribute('role');
      anchor.removeAttribute('aria-disabled');
    }

    // Apply state classes
    const anchorClasses: string[] = [];
    if (this.isActive()) {
      anchorClasses.push('menu-active');
    }
    if (this.isFocused()) {
      anchorClasses.push('menu-focus');
    }
    if (isDisabled) {
      anchorClasses.push('menu-disabled');
    }

    anchor.className = anchorClasses.join(' ');
    li.className = classNames.join(' ');
  }

  /**
   * Sets the submenu for this menu item. The submenu will be marked as a submenu automatically.
   * @param menu - The menu instance to use as a submenu, or undefined to remove the submenu
   * @returns This instance for method chaining
   */
  public setSubmenu(menu: Menu | undefined): this {
    if (menu !== undefined) {
      // Mark submenu as a submenu so it doesn't get the 'menu' class
      menu.isSubmenu(true);
    }
    this.#submenu(menu);
    return this;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('MenuItem');
      register.addString('Label', this.label);
      // Note: Optional strings - property register doesn't have addOptionalString
      // register.addString('Href', this.href);
      register.addOptionalIcon('Icon', this.icon);
      register.addBool('Is title', this.isTitle);
      register.addBool('Is active', this.isActive);
      register.addBool('Is focused', this.isFocused);
    }
  }
}
