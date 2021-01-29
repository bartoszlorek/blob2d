import {removeItem} from './utils/array';

export class Container<TChild> {
  protected readonly children: TChild[];

  constructor() {
    this.children = [];
  }

  public addChild<T extends TChild[]>(...children: T): T[0] {
    this.children.push(...children);
    return children[0];
  }

  public removeChild<T extends TChild[]>(...children: T): T[0] | null {
    // bypass loop
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
    } else if (!removeItem(this.children, children[0])) {
      return null;
    }

    return children[0];
  }

  public destroy(): void {
    this.children.length = 0;
  }
}
