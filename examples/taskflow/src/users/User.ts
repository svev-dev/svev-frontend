export class User {
  public readonly name: string = '';
  public readonly avatarUrl: string | undefined;

  public constructor(name: string, avatarUrl?: string) {
    this.name = name;
    this.avatarUrl = avatarUrl;
  }

  public getInitials(): string {
    return this.name.substring(0, 2).toUpperCase();
  }
}
