import {DisplayObject} from 'pixi.js';
import {Vector2Type} from './types';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> extends Element<AddonsType, EventsType> {
  static EMPTY = new Entity(new DisplayObject(), {});

  public readonly type = 'entity';
  public velocity: Vector2Type;
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
    // render entity based on position from previous step
    this.updateDisplayPosition();

    // update position for traits, addons or renderer in next step
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);

    // call traits that may introduce changes to the entity
    // for next addons or renderer in next step
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].update(deltaTime);
    }
  }

  public destroy() {
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].destroy();
    }
    super.destroy();
  }
}
