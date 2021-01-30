import {Animation, Collisions, Entities} from '../src';
import {BorderLimit, FollowMouse, WaveMove} from './traits';

export type Addons = {
  animation: Animation<Addons, Events, Keyframes>;
  collisions: Collisions<Addons, Traits, Events>;
  entities: Entities<Addons, Traits, Events>;
};

export type Events = 'player/score';

export type Traits = PlayerTraits | EnemyTraits;

export type PlayerTraits = {
  borderLimit: BorderLimit;
  followMouse: FollowMouse;
};

export type EnemyTraits = {
  waveMove: WaveMove;
};

export type Keyframes = 'player_move';
