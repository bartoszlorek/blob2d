import {Application} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {Scene} from './Scene';

const DELTA_TIME = 1 / 60;

export type OwnEventTypes = 'docker/mount' | 'docker/unmount';

export class Docker<
  EventTypes extends string = 'docker/eventName'
> extends EventEmitter<EventTypes | OwnEventTypes> {
  private app: Application;
  private accumulatedTime: number;

  public scene: Scene | null;

  constructor(app: Application) {
    super();

    this.app = app;
    this.accumulatedTime = 0;
    this.scene = null;
  }

  private tick(deltaFrame: number): void {
    if (this.scene === null) return;

    // framerate independent motion
    this.accumulatedTime += DELTA_TIME * deltaFrame;

    while (this.accumulatedTime > DELTA_TIME) {
      this.accumulatedTime -= DELTA_TIME;
      this.scene.update(DELTA_TIME);
    }
  }

  public mount(scene: Scene): void {
    this.unmount();
    this.scene = scene;
    this.app.ticker.add(this.tick, this);
    this.emit('docker/mount');
  }

  public unmount(): void {
    if (this.scene !== null) {
      this.emit('docker/unmount');
      this.app.ticker.remove(this.tick, this);
      this.scene.destroy();
      this.scene = null;
    }
  }

  public destroy(): void {
    this.unmount();
    this.removeAllListeners();
  }
}
