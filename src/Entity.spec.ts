import {Sprite, Container} from 'pixi.js';
import {Scene} from './Scene';
import {Entity} from './Entity';

describe('class Entity', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('updates position of display on own update', () => {
    const sprite = new Sprite();
    const entity = new Entity(sprite, {});

    entity.x = 12;
    entity.y = 32;
    entity.update(0.25);

    expect(sprite.x).toBe(12);
    expect(sprite.y).toBe(32);
  });

  it('applies velocity to position on own update', () => {
    const entity = new Entity(new Sprite(), {});

    entity.x = 12;
    entity.y = 32;
    entity.velocity[0] = 50;
    entity.velocity[1] = 50;
    entity.update(0.5);

    expect(entity.x).toBe(37);
    expect(entity.y).toBe(57);
  });

  it('updates traits on own update', () => {
    const traits = {
      move: {update: jest.fn()},
      jump: {update: jest.fn()},
    };

    const entity = new Entity(new Sprite(), traits);
    entity.update(0.5);

    expect(traits.move.update).toHaveBeenCalledTimes(1);
    expect(traits.jump.update).toHaveBeenCalledTimes(1);
  });

  it('destroys traits when destroyed', () => {
    const traits = {
      move: {destroy: jest.fn()},
      jump: {destroy: jest.fn()},
    };

    const entity = new Entity(new Sprite(), traits);
    entity.destroy();

    expect(traits.move.destroy).toHaveBeenCalledTimes(1);
    expect(traits.jump.destroy).toHaveBeenCalledTimes(1);
  });

  it('removes from a parent scene when destroyed', () => {
    const scene = new Scene(Container);
    const sceneRemoveElement = jest.spyOn(scene, 'removeElement');
    const entity = new Entity(new Sprite(), {});

    entity.scene = scene;
    entity.destroy();
    expect(sceneRemoveElement).toHaveBeenCalledWith(entity);
  });
});
