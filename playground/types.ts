import {Entity} from '../src';

export type EventType = 'player/score';

export type ContextType = {
  player: Entity<EventType>;
};
