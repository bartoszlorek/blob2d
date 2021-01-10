import {Container} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {IComponent} from './types';
import {Element} from './Element';

export class Scene<
  AddonsType extends {},
  EventsType extends string
> extends EventEmitter<EventsType> {
  public addon: AddonsType;
  public graphics: Container;

  protected background: Container;
  protected foreground: Container;

  private _addons: IComponent[];

  constructor(addon: AddonsType) {
    super();

    this.addon = addon;
    this._addons = Object.values(addon);

    // main layers
    this.background = new Container();
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background, this.foreground);
  }

  public addChild<T extends Element<AddonsType, EventsType>>(child: T): T {
    if (child.scene) {
      child.scene.removeChild(child);
    }
    child.scene = this;
    this.foreground.addChild(child.display);
    return child;
  }

  public removeChild<T extends Element<AddonsType, EventsType>>(
    child: T
  ): T | null {
    if (this.foreground.removeChild(child.display) === null) {
      return null;
    }
    child.scene = null;
    return child;
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this._addons.length; i++) {
      this._addons[i].update(deltaTime);
    }
  }

  public destroy(): void {
    this.graphics.destroy({children: true});
    this.removeAllListeners();
  }
}
