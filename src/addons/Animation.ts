import {ISprite} from '../_pixijs';
import {IAddon, IKeyframesDictionary} from '../_types';

export class Animation<TKeys extends string> implements IAddon {
  protected keyframes: IKeyframesDictionary<TKeys>;

  constructor(keyframes?: IKeyframesDictionary<TKeys>) {
    this.keyframes = keyframes || ({} as IKeyframesDictionary<TKeys>);
  }

  public addKeyframe(name: TKeys, firstgid: number, lastgid: number): void {
    if (this.keyframes[name]) {
      throw new Error(`"${name}" keyframe already exists.`);
    }

    this.keyframes[name] = {
      currentFrame: 0,
      firstgid,
      lastgid,
    };
  }

  public removeKeyframe(name: TKeys): void {
    this.keyframes[name] = null;
  }

  public requestFrame(name: TKeys, sprite: ISprite): void {
    console.log({name, sprite});
  }

  public update(deltaTime: number): void {
    // ...
  }

  public destroy(): void {
    // ...
  }
}
