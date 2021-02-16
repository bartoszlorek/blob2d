import {Trait} from 'blob2d';
import {Addons, Events, Traits} from '../types';

export class CustomTrait extends Trait<Addons, Traits, Events> {
  update(deltaTime: number) {
    console.log('CustomTrait/update', this.entity);
  }

  destroy() {
    console.log('CustomTrait/destroy');
  }
}
