import {IApplication} from './_pixijs';
import {EventEmitter} from 'eventemitter3';
import {Scene} from './Scene';

const DELTA_TIME = 1 / 60;

export type TOwnEvents = 'docker/mount' | 'docker/unmount';

export class Docker<
  TAddons extends {},
  TEvents extends string
> extends EventEmitter<TEvents | TOwnEvents> {
  public scene: Scene<TAddons, TEvents> | null;

  private app: IApplication;
  private accumulatedTime: number;

  constructor(app: IApplication) {
    super();

    this.scene = null;
    this.app = app;
    this.accumulatedTime = 0;
  }

  private tick(deltaFrame: number) {
    if (this.scene === null) return;

    // framerate independent motion
    this.accumulatedTime += DELTA_TIME * deltaFrame;

    while (this.accumulatedTime > DELTA_TIME) {
      this.accumulatedTime -= DELTA_TIME;
      this.scene.update(DELTA_TIME);
    }
  }

  public mount(scene: Scene<TAddons, TEvents>) {
    this.unmount();
    this.scene = scene;

    // start rendering
    this.app.ticker.add(this.tick, this);
    this.app.stage.addChild(scene.graphics);

    this.emit('docker/mount');
  }

  public unmount() {
    if (this.scene !== null) {
      this.emit('docker/unmount');

      // stop rendering
      this.app.ticker.remove(this.tick, this);
      this.app.stage.removeChild(this.scene.graphics);

      this.scene.destroy();
      this.scene = null;
    }
  }

  public destroy() {
    this.unmount();
    this.removeAllListeners();
  }
}
