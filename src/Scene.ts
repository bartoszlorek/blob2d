import {Container} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {IAddon} from './types';
import {Element} from './Element';

export type OwnEventsType =
  | 'scene/addChild'
  | 'scene/removeChild'
  | 'scene/destroy';

export class Scene<
  AddonsType extends {},
  EventsType extends string
> extends EventEmitter<EventsType | OwnEventsType> {
  public addon: AddonsType;
  public graphics: Container;

  protected background: Container;
  protected foreground: Container;

  private _addons: IAddon[];
  private _removeStack: Element<AddonsType, EventsType>[];
  private _removeIndex: number;

  constructor() {
    super();

    this.addon = {} as AddonsType;
    this._addons = [];

    // main layers
    this.background = new Container();
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background, this.foreground);

    // processing
    this._removeStack = [];
    this._removeIndex = 0;
  }

  public registerAddons(addons: AddonsType): void {
    this.addon = addons;
    this._addons = Object.values(addons);
  }

  public addChild<T extends Element<AddonsType, EventsType>[]>(
    ...children: T
  ): T[0] {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.addChild(children[i]);
      }
    } else {
      const child = children[0];

      if (child.scene) {
        child.scene.removeChild(child);
      }
      child.scene = this;
      this.foreground.addChild(child.display);
      this.emit('scene/addChild', child);
    }

    return children[0];
  }

  public removeChild<T extends Element<AddonsType, EventsType>[]>(
    ...children: T
  ): void {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
    } else {
      this._removeStack[this._removeIndex++] = children[0];
    }
  }

  private unsafeRemoveChild<T extends Element<AddonsType, EventsType>>(
    child: T
  ): void {
    if (this.foreground.removeChild(child.display)) {
      this.emit('scene/removeChild', child);
      child.scene = null;
    }
  }

  public update(deltaTime: number): void {
    // request changes phase
    for (let i = 0; i < this._addons.length; i++) {
      this._addons[i].update(deltaTime);
    }

    // cleanup phase
    while (this._removeIndex > 0) {
      this.unsafeRemoveChild(this._removeStack[--this._removeIndex]);
    }
  }

  public destroy(): void {
    this.emit('scene/destroy');
    this.removeAllListeners();

    for (let i = 0; i < this._addons.length; i++) {
      this._addons[i].destroy();
    }
    this._addons.length = 0;
    this._removeStack.length = 0;

    // remove all pixijs dependencies
    this.graphics.destroy({children: true});
  }
}
