import {IAddon} from 'blob2d';

export class CustomAddon implements IAddon {
  update(deltaTime: number) {
    console.log('CustomAddon/update');
  }

  destroy() {
    console.log('CustomAddon/destroy');
  }
}
