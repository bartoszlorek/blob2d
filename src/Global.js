// @flow strict

import PIXI, {Application} from 'pixi.js';
import {EventEmitter} from './EventEmitter';
import {Scene} from './Scene';
import {type GlobalEventType} from './GlobalTypes';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

type ConstructorProps = {
  backgroundColor: number,
  framesPerSecond?: number,
};

export class Global<CustomEventType> {
  __accumulatedTime: number;
  __app: typeof Application;

  events: EventEmitter<CustomEventType | GlobalEventType>;
  scene: Scene<CustomEventType> | null;

  constructor({backgroundColor, framesPerSecond = 60}: ConstructorProps) {
    this.__accumulatedTime = 0;
    this.__app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor,
      antialias: false,
    });

    // public properties
    this.events = new EventEmitter<CustomEventType | GlobalEventType>();
    this.scene = null;

    // handle global events
    window.addEventListener('resize', () => {
      this.__app.renderer.resize(window.innerWidth, window.innerHeight);
      this.events.emit('global/resize', this);
    });

    const deltaTime = 1 / framesPerSecond;

    // handle framerate independent motion
    this.__app.ticker.add((deltaFrame: number) => {
      if (this.scene) {
        this.__accumulatedTime += deltaTime * deltaFrame;

        while (this.__accumulatedTime > deltaTime) {
          this.__accumulatedTime -= deltaTime;
          this.scene.update(deltaTime);
        }
      }
    });

    if (document.body) {
      document.body.appendChild(this.__app.view);
    }
  }

  mount(scene: Scene<CustomEventType>) {
    this.unmount();
    this.events.emit('global/mount', scene);
    this.scene = scene;
    scene.global = this;
  }

  unmount() {
    const currentScene = this.scene;
    if (currentScene !== null) {
      this.events.emit('global/unmount', currentScene);
      this.scene = null;
      currentScene.destroy();
      currentScene.global = null;
    }
  }
}
