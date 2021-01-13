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

  public readonly type = 'entity';
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
    // set position based on velocity from the previous frame
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);

    // invoke traits that may change velocity for the next
    // frame or correct display position for the current one
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].update(deltaTime);
    }

    // change visuals of display object based on the final position
    this.updateDisplayPosition();
  }

  public destroy() {
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].destroy();
    }
    super.destroy();
  }
}
