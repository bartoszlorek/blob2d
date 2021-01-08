import {DisplayObject} from 'pixi.js';
import {VectorType} from './types';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<EventType extends string> extends Element<EventType> {
  public velocity: VectorType;
  protected traits: Trait<EventType>[];
  public trait: {[name: string]: Trait<EventType>};

  constructor(display: DisplayObject, min: VectorType, max: VectorType) {
    super(display, min, max);
    this.velocity = [0, 0];
    this.traits = [];
    this.trait = {};
  }

  public update(deltaTime: number): void {
    // update position from the previous frame
    this.updateDisplayPosition();

    // update traits
    for (let i = 0; i < this.traits.length; i++) {
      this.traits[i].update(deltaTime);
    }

    // update velocity from the current frame
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  public addTrait(trait: Trait<EventType>): void {
    this.traits.push(trait);
    this.trait[trait.name] = trait;
    trait.parent = this;
  }

  public destroy() {
    for (let i = 0; i < this.traits.length; i++) {
      this.traits[i].destroy();
    }
    super.destroy();
  }
}
