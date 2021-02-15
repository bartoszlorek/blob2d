import {Animation, Entities} from 'blob2d';
import {CustomAddon} from './addons';
import {CustomTrait} from './traits';

export type Addons = {
  animation: Animation;
  entities: Entities;
  customAddon: CustomAddon;
};

export type Events = 'player/score';

// union of particular traits
export type Traits = PlayerTraits;

export type PlayerTraits = {
  customTrait: CustomTrait;
};

export type Keyframes = 'player/move';
