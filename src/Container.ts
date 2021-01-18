import {removeItem} from './utils/array';

export class Container<ChildType> {
  protected readonly children: ChildType[];

  constructor() {
    this.children = [];
  }

  public addChild<T extends ChildType[]>(...children: T): T[0] {
    this.children.push(...children);
    return children[0];
  }

  public removeChild<T extends ChildType[]>(...children: T): T[0] | null {
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
