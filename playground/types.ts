import {Animation, Collisions, Entities} from '../src';
import {BorderLimit, FollowMouse, WaveMovement} from './traits';

export type Addons = {
  animation: Animation<Addons, Events, Keyframes>;
  collisions: Collisions<Addons, Traits, Events>;
  entities: Entities<Addons, Traits, Events>;
};

export type Events = 'player/score';

export type Traits = PlayerTraits | PlatformTraits;

export type PlayerTraits = {
  borderLimit: BorderLimit;
  followMouse: FollowMouse;
};

export type PlatformTraits = {
  waveMovement: WaveMovement;
};

export type Keyframes = 'player_move';
