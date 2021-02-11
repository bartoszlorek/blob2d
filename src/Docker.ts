import {IApplication} from './_pixijs';
import {Scene} from './Scene';

const DELTA_TIME = 1 / 60;

export class Docker<TAddons extends {}, TEvents extends string> {
  public readonly app: IApplication;
  public scene: Scene<TAddons, TEvents> | null;

  private _accumulatedTime: number;

  constructor(app: IApplication) {
    this.app = app;
    this.scene = null;

    // processing
    this._accumulatedTime = 0;
  }

  /**
   * Unmounts the current scene and mounts the given one.
   */
  public mount(scene: Scene<TAddons, TEvents>) {
    this.unmount();
    this.scene = scene;

    // start rendering
    this.app.ticker.add(this.tick, this);
    this.app.stage.addChild(scene.graphics);

    scene.emit('mount', scene);
  }

  /**
   * Unmounts the current scene.
   */
  public unmount() {
    if (this.scene !== null) {
      this.scene.emit('unmount', this.scene);

      // stop rendering
      this.app.ticker.remove(this.tick, this);
      this.app.stage.removeChild(this.scene.graphics);

      this.scene.destroy();
      this.scene = null;
    }
  }

  /**
   * Updates the current scene and provides framerate independent motion.
   */
  private tick(deltaFrame: number) {
    // at this moment the scene should be always mounted
    const scene = this.scene as Scene<TAddons, TEvents>;

    this._accumulatedTime += DELTA_TIME * deltaFrame;

    while (this._accumulatedTime > DELTA_TIME) {
      this._accumulatedTime -= DELTA_TIME;
      scene.update(DELTA_TIME);
    }
  }
}
