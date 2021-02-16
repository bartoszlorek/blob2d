import {Animation, Camera, Collisions, Entities} from 'blob2d';
import {FollowMouse, WaveMovement} from './traits';

export type Addons = {
  camera: Camera<Addons, Events>;
  animation: Animation<Addons, Events, Keyframes>;
  collisions: Collisions<Addons, Traits, Events>;
  entities: Entities<Addons, Traits, Events>;
};

export type Events = 'player/score';

export type Traits = PlayerTraits | PlatformTraits;

export type PlayerTraits = {
  followMouse: FollowMouse;
};

export type PlatformTraits = {
  waveMovement: WaveMovement;
};

export type Keyframes = 'player_move';
