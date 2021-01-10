import {Application} from 'pixi.js';
import {EventEmitter} from 'eventemitter3';
import {Scene} from './Scene';

const DELTA_TIME = 1 / 60;

export type OwnEventsType = 'docker/mount' | 'docker/unmount';

export class Docker<
  AddonsType extends {},
  EventsType extends string
> extends EventEmitter<EventsType | OwnEventsType> {
  public scene: Scene<AddonsType, EventsType> | null;

  private app: Application;
  private accumulatedTime: number;

  constructor(app: Application) {
    super();

    this.scene = null;
    this.app = app;
    this.accumulatedTime = 0;
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

  public mount(scene: Scene<AddonsType, EventsType>): void {
    this.unmount();
    this.scene = scene;

    // start rendering
    this.app.ticker.add(this.tick, this);
    this.app.stage.addChild(scene.graphics);

    this.emit('docker/mount');
  }

  public unmount(): void {
    if (this.scene !== null) {
      this.emit('docker/unmount');

      // stop rendering
      this.app.ticker.remove(this.tick, this);
      this.app.stage.removeChild(this.scene.graphics);

      this.scene.destroy();
      this.scene = null;
    }
  }

  public destroy(): void {
    this.unmount();
    this.removeAllListeners();
  }
}
