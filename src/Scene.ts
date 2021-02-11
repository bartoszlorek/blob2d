import {IAddon} from './_types';
import {IContainerConstructor, IContainer} from './_pixijs';
import {EventEmitter} from 'eventemitter3';
import {Element} from './Element';

export type TOwnEvents =
  | 'scene/addElement'
  | 'scene/removeElement'
  | 'scene/mount'
  | 'scene/unmount'
  | 'scene/destroy';

export class Scene<
  TAddons extends {},
  TEvents extends string
> extends EventEmitter<TEvents | TOwnEvents> {
  public readonly addons: TAddons;
  public readonly graphics: IContainer;
  public readonly foreground: IContainer;
  public readonly background: IContainer;

  private _addonsList: IAddon[];
  private _removeStack: Element<TAddons, TEvents>[];
  private _removeIndex: number;

  constructor(BaseContainer: IContainerConstructor) {
    super();

    this.addons = {} as TAddons;
    this._addonsList = [];

    // main layers
    this.foreground = new BaseContainer();
    this.background = new BaseContainer();
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
    // TODO: better way to initialize addons in constructor
    // @ts-ignore
    this.addons = addons;
    // @ts-ignore
    this._addonsList = Object.values(addons);
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
    for (let i = 0; i < this._addonsList.length; i++) {
      this._addonsList[i].update(deltaTime);
    }

    // actual removing phase
    while (this._removeIndex > 0) {
      this.unsafeRemoveElement(this._removeStack[--this._removeIndex]);
    }
  }

  /**
   * Clears all added events and destroys addons
   * and elements removing them from the renderer.
   */
  public destroy() {
    this.emit('scene/destroy');
    this.removeAllListeners();

    for (let i = 0; i < this._addonsList.length; i++) {
      this._addonsList[i].destroy();
    }

    this._addonsList.length = 0;
    this._removeStack.length = 0;

    // remove all pixijs dependencies
    this.graphics.destroy({children: true});
  }
}
