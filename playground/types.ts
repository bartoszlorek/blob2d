import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse} from './traits';

export type AddonsType = {
  animation: Animation;
  entities: Entities;
};

export type EventsType = 'player/score';

export type TraitsType = PlayerTraits | EnemyTraits;

export type PlayerTraits = {
  borderLimit: BorderLimit;
  followMouse: FollowMouse;
};

export type EnemyTraits = {
  borderLimit: BorderLimit;
};
