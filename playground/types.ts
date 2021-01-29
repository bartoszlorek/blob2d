import {Collisions} from '../src';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse, WaveMove} from './traits';

export type Addons = {
  animation: Animation;
  collisions: Collisions<Addons, Traits, Events>;
  entities: Entities;
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
