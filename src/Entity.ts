import {DisplayObject} from 'pixi.js';
import {VectorType} from './types';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> extends Element<AddonsType, EventsType> {
  static EMPTY = new Entity(new DisplayObject(), {});

  public velocity: VectorType;
  public trait: {[name: string]: Trait<AddonsType, TraitsType, EventsType>};

  private _traits: Trait<AddonsType, TraitsType, EventsType>[];

  constructor(display: DisplayObject, traits: TraitsType) {
    super(display);

    this.velocity = [0, 0];
    this.trait = traits;
    this._traits = Object.values(traits);

    // assign this entity to traits
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].entity = this;
    }
  }

  public update(deltaTime: number): void {
    // display phase from the previous frame
    this.updateDisplayPosition();

    // traits phase from the current frame
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].update(deltaTime);
    }

    // velocity phase from the current frame
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  public destroy() {
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].destroy();
    }
    super.destroy();
  }
}
