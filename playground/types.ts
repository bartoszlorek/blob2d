import {Element} from '../src';

export type EventType = 'player/score';

export type RefsType<EventType extends string = string> = {
  player: Element<EventType>;
};
