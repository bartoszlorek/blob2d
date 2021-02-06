import {TVector2} from './_types';
import {ISprite, NopSprite} from './_pixijs';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> extends Element<TAddons, TEvents, ISprite> {
  static EMPTY = new Entity(new NopSprite(), {});

  // general type of the element
  public readonly type = 'entity';

  // controls whether physics affects the rigidbody
  public physics: 'dynamic' | 'kinematic' = 'dynamic';
  public velocity: TVector2;
  public trait: TTraits;

  private _traits: Trait<TAddons, TTraits, TEvents>[];

  constructor(display: ISprite, traits: TTraits) {
    super(display);

    this.velocity = [0, 0];
    this.trait = traits;
    this._traits = Object.values(traits);

    // assign this entity to traits
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].entity = this;
    }
  }

  /**
   * Updates each trait and applies velocity.
   */
  public update(deltaTime: number) {
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

  /**
   * Clears traits data.
   */
  public destroy() {
    for (let i = 0; i < this._traits.length; i++) {
      this._traits[i].destroy();
    }
    super.destroy();
  }
}
