import {IAddon} from './_types';
import {IContainerConstructor, IContainer} from './_pixijs';
import {EventEmitter} from 'eventemitter3';
import {Element} from './Element';

export type TOwnEvents =
  | 'scene/addElement'
  | 'scene/removeElement'
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

  /**
   * Should be called in the constructor before
   * accessing any addons of the current scene.
   */
  public registerAddons(addons: TAddons) {
    this.addon = addons;
    this._addons = Object.values(addons);
  }

  /**
   * Adds one or many elements.
   */
  public addElement<T extends Element<TAddons, TEvents>[]>(...elems: T) {
    // bypass loop for one element
    if (elems.length > 1) {
      for (let i = 0; i < elems.length; i++) {
        this.addElement(elems[i]);
      }
    } else {
      const elem = elems[0];

      if (elem.scene) {
        elem.scene.removeElement(elem);
      }

      elem.scene = this;
      this.foreground.addChild(elem.display);
      this.emit('scene/addElement', elem);
    }
  }

  /**
   * Removes one or many elements.
   */
  public removeElement<T extends Element<TAddons, TEvents>[]>(...elems: T) {
    // bypass loop for one element
    if (elems.length > 1) {
      for (let i = 0; i < elems.length; i++) {
        this._removeStack[this._removeIndex++] = elems[i];
      }
    } else {
      this._removeStack[this._removeIndex++] = elems[0];
    }
  }

  private unsafeRemoveElement<T extends Element<TAddons, TEvents>>(elem: T) {
    if (this.foreground.removeChild(elem.display)) {
      this.emit('scene/removeElement', elem);
      elem.scene = null;
    }
  }

  /**
   * Updates registered addons and perform the actual
   * removal of garbage collected elements.
   */
  public update(deltaTime: number) {
    // addons or traits may request to remove an element
    for (let i = 0; i < this._addons.length; i++) {
      this._addons[i].update(deltaTime);
    }

    // actual removing phase
    while (this._removeIndex > 0) {
      this.unsafeRemoveElement(this._removeStack[--this._removeIndex]);
    }
  }

  /**
   * Clears all added events and addons
   * and removes elements from the renderer.
   */
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
