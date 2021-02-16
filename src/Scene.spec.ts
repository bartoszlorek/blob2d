import {Container} from 'pixi.js';
import {Element} from './Element';
import {Scene} from './Scene';
import {IAddon} from './types';

console.error = jest.fn();

const mockAddon = (): IAddon => ({
  update: jest.fn(),
  destroy: jest.fn(),
});

describe('class Scene', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('registers given addons', () => {
    const scene = new Scene(Container);
    const addons = {
      camera: mockAddon(),
      animation: mockAddon(),
    };

    scene.registerAddons(addons);
    expect(scene.addons).toEqual(addons);
  });

  it('adds a display to the foreground', () => {
    const display = new Container();
    const scene = new Scene(Container);
    const foregroundAddChild = jest.spyOn(scene.foreground, 'addChild');

    scene.addElement(new Element(display));
    expect(foregroundAddChild).toHaveBeenCalledWith(display);
  });

  it('adds multiple elements', () => {
    const display1 = new Container();
    const display2 = new Container();
    const scene = new Scene(Container);
    const foregroundAddChild = jest.spyOn(scene.foreground, 'addChild');

    scene.addElement(new Element(display1), new Element(display2));
    expect(foregroundAddChild).toHaveBeenCalledWith(display1);
    expect(foregroundAddChild).toHaveBeenCalledWith(display2);
  });

  it('assigns itself to the scene field of the element', () => {
    const element = new Element(new Container());
    const scene = new Scene(Container);

    scene.addElement(element);
    expect(element.scene).toBe(scene);
  });

  it('emits an event adding a new element', () => {
    const element = new Element(new Container());
    const scene = new Scene(Container);
    const sceneEmit = jest.spyOn(scene, 'emit');

    scene.addElement(element);
    expect(sceneEmit).toHaveBeenCalledWith('elementAdded', element);
  });

  it('logs an error adding a element twice', () => {
    const element = new Element(new Container());
    const scene = new Scene(Container);

    scene.addElement(element);
    scene.addElement(element);
    scene.addElement(element);

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('removes a display from the foreground', () => {
    const display = new Container();
    const element = new Element(display);
    const scene = new Scene(Container);
    const foregroundRemoveChild = jest.spyOn(scene.foreground, 'removeChild');

    scene.addElement(element);
    scene.removeElement(element);
    scene.update(0.5);

    expect(foregroundRemoveChild).toHaveBeenCalledWith(display);
  });

  it('removes actual elements after update', () => {
    const element1 = new Element(new Container());
    const element2 = new Element(new Container());
    const scene = new Scene(Container);
    const foregroundRemoveChild = jest.spyOn(scene.foreground, 'removeChild');

    scene.addElement(element1, element2);
    scene.removeElement(element1, element2);
    expect(foregroundRemoveChild).toHaveBeenCalledTimes(0);

    scene.update(0.5);
    expect(foregroundRemoveChild).toHaveBeenCalledTimes(2);
  });

  it('emits an event removing an element', () => {
    const element = new Element(new Container());
    const scene = new Scene(Container);
    const sceneEmit = jest.spyOn(scene, 'emit');

    scene.addElement(element);
    scene.removeElement(element);
    scene.update(0.5);

    expect(sceneEmit).toHaveBeenCalledWith('elementRemoved', element);
  });

  it('updates addons on own update', () => {
    const scene = new Scene(Container);
    const addons = {
      camera: mockAddon(),
      animation: mockAddon(),
    };

    scene.registerAddons(addons);
    scene.update(0.5);

    expect(addons.camera.update).toHaveBeenCalledTimes(1);
    expect(addons.animation.update).toHaveBeenCalledTimes(1);
  });

  it('removes all added listeners when destroyed', () => {
    const scene = new Scene(Container);
    const sceneRemoveAllListeners = jest.spyOn(scene, 'removeAllListeners');

    scene.destroy();
    expect(sceneRemoveAllListeners).toHaveBeenCalledTimes(1);
  });

  it('destroys addons when destroyed', () => {
    const scene = new Scene(Container);
    const addons = {
      camera: mockAddon(),
      animation: mockAddon(),
    };

    scene.registerAddons(addons);
    scene.destroy();

    expect(addons.camera.destroy).toHaveBeenCalledTimes(1);
    expect(addons.animation.destroy).toHaveBeenCalledTimes(1);
  });

  it('destroys graphics when destroyed', () => {
    const scene = new Scene(Container);
    const graphicsDestroy = jest.spyOn(scene.graphics, 'destroy');

    scene.destroy();
    expect(graphicsDestroy).toHaveBeenCalledWith({children: true});
  });
});
