import type { Element } from 'svev-frontend';
import { UIElement } from 'svev-frontend';
import { Avatar } from 'svev-daisyui';
import type { User } from './User';

export class UserAvatarView extends UIElement {
  readonly #user: User;

  public constructor(user: User) {
    super();
    this.#user = user;
  }

  protected createUI(): Element {
    const user = this.#user;
    const avatar = new Avatar().size('sm');

    if (user.avatarUrl !== undefined) {
      avatar.imageSrc(user.avatarUrl).imageAlt(user.name);
    } else {
      avatar.placeholder(user.getInitials());
    }

    return avatar;
  }
}
