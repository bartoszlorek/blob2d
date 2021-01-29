import {Vector2Type} from './_types';
import {IDisplayObject, NopDisplayObject} from './_pixijs';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> extends Element<TAddons, TEvents> {
  static EMPTY = new Entity(new NopDisplayObject(), {});

  public readonly type = 'entity';
  public velocity: Vector2Type;
  public trait: {[name: string]: Trait<TAddons, TTraits, TEvents>};

  private _traits: Trait<TAddons, TTraits, TEvents>[];

  constructor(display: IDisplayObject, traits: TTraits) {
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

  public destroy(): void {
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].destroy();
    }
    super.destroy();
  }
}
