import {ISprite} from '../_pixijs';
import {IAddon, IKeyframesDictionary} from '../_types';
import {TiledSpriteSheet} from '../tiled';
import {Scene} from '../Scene';

type TCachedFrames<TKeys extends string> = {[K in TKeys]: number};

const DELTA_TIME_PER_FRAME = 1 / 12;

export class Animation<
  TAddons extends {},
  TEvents extends string,
  TKeys extends string
> implements IAddon {
  public readonly deltaTimePerFrame: number;

  protected spritesheet: TiledSpriteSheet;
  protected keyframes: IKeyframesDictionary<TKeys>;

  private accumulatedTime: number;
  private requests: Map<ISprite, TKeys>;
  private cachedFrames: Map<ISprite, TCachedFrames<TKeys>>;
  private playing: Map<ISprite, TKeys>;

  constructor(
    scene: Scene<TAddons, TEvents>,
    spritesheet: TiledSpriteSheet,
    keyframes: IKeyframesDictionary<TKeys>,
    deltaTimePerFrame: number = DELTA_TIME_PER_FRAME
  ) {
    this.spritesheet = spritesheet;
    this.keyframes = keyframes;

    // animation may run at a different FPS than the application
    this.deltaTimePerFrame = deltaTimePerFrame;
    this.accumulatedTime = 0;

    // internal processing
    this.requests = new Map();
    this.cachedFrames = new Map();
    this.playing = new Map();

    scene.on('scene/removeChild', (sprite) => {
      this.removeCache(sprite);
    });
  }

  public play(name: TKeys, sprite: ISprite): void {
    this.playing.set(sprite, name);
  }

  public pause(sprite: ISprite): void {
    this.playing.delete(sprite);
  }

  public update(deltaTime: number): void {
    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime >= this.deltaTimePerFrame) {
      this.addPlayRequests();
      this.resolveRequests();
      this.accumulatedTime = 0;
    }
  }

  public requestFrame(name: TKeys, sprite: ISprite): void {
    this.requests.set(sprite, name);

    if (this.cachedFrames.has(sprite)) {
      const spriteCachedFrames = this.cachedFrames.get(
        sprite
      ) as TCachedFrames<TKeys>;

      // initialize a cached frame for the specified keyframe name
      if (spriteCachedFrames[name] === undefined) {
        spriteCachedFrames[name] = 0;
      }
    } else {
      // initialize cached frames for the sprite
      const initialCachedFrames = {[name]: 0} as TCachedFrames<TKeys>;
      this.cachedFrames.set(sprite, initialCachedFrames);
    }
  }

  protected addPlayRequests(): void {
    for (let [sprite, name] of this.playing) {
      this.requestFrame(name, sprite);
    }
  }

  protected resolveRequests(): void {
    for (let [sprite, name] of this.requests) {
      const spriteCachedFrames = this.cachedFrames.get(
        sprite
      ) as TCachedFrames<TKeys>;

      const {firstGID, lastGID} = this.keyframes[name];
      const currentFrameGID = firstGID + spriteCachedFrames[name];

      sprite.texture = this.spritesheet.getTextureByGID(currentFrameGID);

      // advance frame for the next update
      spriteCachedFrames[name] += 1;

      if (currentFrameGID >= lastGID) {
        spriteCachedFrames[name] = 0;
      }
    }

    // each update has separate requests
    this.requests.clear();
  }

  protected removeCache(sprite: ISprite): void {
    this.requests.delete(sprite);
    this.cachedFrames.delete(sprite);
    this.playing.delete(sprite);
  }

  public destroy(): void {
    this.requests.clear();
    this.cachedFrames.clear();
    this.playing.clear();
  }
}
