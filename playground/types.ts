import {Element} from '../src';

export type EventType = 'player/score';

export type ContextType = {
  player: Element<EventType>;
};
