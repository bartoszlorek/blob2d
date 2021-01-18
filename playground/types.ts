import {Addons} from '../src';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse, WaveMove} from './traits';

export type AddonsType = {
  animation: Animation;
  collisions: Addons.Collisions<AddonsType, TraitsType, EventsType>;
  entities: Entities;
};

export type EventsType = 'player/score';

export type TraitsType = PlayerTraits | EnemyTraits;

export type PlayerTraits = {
  borderLimit: BorderLimit;
  followMouse: FollowMouse;
};

export type EnemyTraits = {
  waveMove: WaveMove;
};
