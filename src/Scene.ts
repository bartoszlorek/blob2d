import {IAddon} from './_types';
import {IContainerConstructor, IContainer} from './_pixijs';
import {EventEmitter} from 'eventemitter3';
import {Element} from './Element';

export type TOwnEvents =
  | 'scene/addChild'
  | 'scene/removeChild'
  | 'scene/destroy';

export class Scene<
  TAddons extends {},
  TEvents extends string
> extends EventEmitter<TEvents | TOwnEvents> {
  public addon: TAddons;
  public graphics: IContainer;

  protected background: IContainer;
  protected foreground: IContainer;

  private _addons: IAddon[];
  private _removeStack: Element<TAddons, TEvents>[];
  private _removeIndex: number;

  constructor(BaseContainer: IContainerConstructor) {
    super();

    this.addon = {} as TAddons;
    this._addons = [];

    // main layers
    this.background = new BaseContainer();
    this.foreground = new BaseContainer();

    this.graphics = new BaseContainer();
    this.graphics.addChild(this.background, this.foreground);

    // processing
    this._removeStack = [];
    this._removeIndex = 0;
  }

  public registerAddons(addons: TAddons) {
    this.addon = addons;
    this._addons = Object.values(addons);
  }

  public addChild<T extends Element<TAddons, TEvents>[]>(...children: T): T[0] {
    // for one argument we can bypass looping through them
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

  public removeChild<T extends Element<TAddons, TEvents>[]>(...children: T) {
    // for one argument we can bypass looping through them
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
    } else {
      this._removeStack[this._removeIndex++] = children[0];
    }
  }

  private unsafeRemoveChild<T extends Element<TAddons, TEvents>>(child: T) {
    if (this.foreground.removeChild(child.display)) {
      this.emit('scene/removeChild', child);
      child.scene = null;
    }
  }

  public update(deltaTime: number) {
    // addons or traits may request to remove a child
    for (let i = 0; i < this._addons.length; i++) {
      this._addons[i].update(deltaTime);
    }

    // actual removing phase
    while (this._removeIndex > 0) {
      this.unsafeRemoveChild(this._removeStack[--this._removeIndex]);
    }
  }

  public destroy() {
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
