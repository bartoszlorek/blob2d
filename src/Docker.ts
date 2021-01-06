import {Application} from 'pixi.js';
import {Scene} from './Scene';

const DELTA_TIME = 1 / 60;

export class Docker {
  private app: Application;
  private accumulatedTime: number;

  public scene: Scene | null;

  constructor(app: Application) {
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
  }

  public unmount(): void {
    if (this.scene !== null) {
      this.app.ticker.remove(this.tick, this);
      this.scene.destroy();
      this.scene = null;
    }
  }
}
