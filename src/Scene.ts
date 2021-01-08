import {utils, Container} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {Element} from './Element';

export class Scene<EventType extends string> extends EventEmitter<EventType> {
  protected readonly children: Element<EventType>[];

  protected background: Container;
  protected foreground: Container;
  public graphics: Container;

  constructor() {
    super();
    this.children = [];

    // main layers
    this.background = new Container();
    this.foreground = new Container();

    this.graphics = new Container();
    this.graphics.addChild(this.background, this.foreground);
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime);
    }
  }

  public addChild<T extends Element<EventType>>(child: T): T {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    this.children.push(child);
    this.foreground.addChild(child.display);
    return child;
  }

  public removeChild<T extends Element<EventType>>(child: T): T | null {
    const index = this.children.indexOf(child);

    if (index === -1) {
      return null;
    }

    child.parent = null;
    utils.removeItems(this.children, index, 1);
    this.foreground.removeChild(child.display);
    return child;
  }

  public destroy(): void {
    this.children.length = 0;
    this.graphics.destroy({children: true});
    this.removeAllListeners();
  }
}
