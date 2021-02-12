import {Container} from 'pixi.js';
import {IAddon, IContainerConstructor} from './types';
import {EventEmitter} from 'eventemitter3';
import {Element} from './Element';

export type TOwnEvents =
  | 'mount'
  | 'unmount'
  | 'elementAdded'
  | 'elementRemoved';

export class Scene<
  TAddons extends {},
  TEvents extends string
> extends EventEmitter<TEvents | TOwnEvents> {
  public readonly addons: TAddons;
  public readonly foreground: Container;
  public readonly background: Container;
  public readonly graphics: Container;

  private _addonsList: IAddon[];
  private _removeStack: Element<TAddons, TEvents>[];
  private _removeIndex: number;

  constructor(BaseContainer: IContainerConstructor) {
    super();

    this.addons = {} as TAddons;

    // renderer layers
    this.foreground = new BaseContainer();
    this.background = new BaseContainer();
    this.graphics = new BaseContainer();
    this.graphics.addChild(this.background, this.foreground);

    // processing
    this._addonsList = [];
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
        if (elem.scene === this) {
          const elemName = elem.name || elem.constructor.name;
          const sceneName = this.constructor.name;

          return console.error(
            `The "${elemName}" [Element] is already added to the "${sceneName}" [Scene].`
          );
        }

        elem.scene.removeElement(elem);
      }

      elem.scene = this;
      this.foreground.addChild(elem.display);
      this.emit('elementAdded', elem);
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
      this.emit('elementRemoved', elem);
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
