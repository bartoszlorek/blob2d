import {utils, Container} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {Camera} from './Camera';
import {Element} from './Element';

export class Scene<
  EventType extends string = string,
  RefsType = {}
> extends EventEmitter<EventType> {
  protected camera: Camera | null;
  protected readonly children: Element<EventType>[];
  protected refs: Partial<RefsType>;

  protected background: Container;
  protected foreground: Container;
  public graphics: Container;

  constructor() {
    super();

    this.camera = null;
    this.children = [];
    this.refs = {};

    // pixijs layers
    this.background = new Container();
    this.foreground = new Container();
    this.graphics = new Container();
    this.graphics.addChild(this.background, this.foreground);
  }

  public update(deltaTime: number): void {
    if (this.camera !== null) {
      this.foreground.x = this.camera.offsetX;
      this.foreground.y = this.camera.offsetY;
    }
  }

  public addChild(child: Element<EventType>): Element<EventType> {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
    this.foreground.addChild(child.sprite);
    return child;
  }

  public removeChild(child: Element<EventType>): Element<EventType> | null {
    const index = this.children.indexOf(child);

    if (index === -1) {
      return null;
    }
    child.parent = null;
    utils.removeItems(this.children, index, 1);
    this.foreground.removeChild(child.sprite);
    return child;
  }

  public destroy(): void {
    this.removeAllListeners();
    this.graphics.destroy({children: true});
    this.children.length = 0;
    this.refs = {};
  }
}
