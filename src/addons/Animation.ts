import {IAddon} from '../_types';

export class Animation implements IAddon {
  public animate(): void {
    console.log('animate');
  }

  public update(deltaTime: number): void {
    // ...
  }

  public destroy(): void {
    // ...
  }
}
