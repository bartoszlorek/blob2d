import {DisplayObject, Container} from 'pixi.js';
import {Element} from './Element';
import {Scene} from './Scene';

class ElementWrapper<A, E extends string> extends Element<A, E> {
  testUpdateDisplay() {
    this.updateDisplay();
  }
}

describe('class Element', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with zero transform values', () => {
    const element = new Element(new DisplayObject());

    expect(element).toMatchObject({
      min: [0, 0],
      max: [0, 0],
      _width: 0,
      _height: 0,
    });
  });

  it('updates position of display based on min values', () => {
    const display = new DisplayObject();
    const element = new ElementWrapper(display);

    element.x = 12;
    element.y = 36;
    element.testUpdateDisplay();

    expect(display.x).toBe(12);
    expect(display.y).toBe(36);
  });

  it('removes from a parent scene when destroyed', () => {
    const scene = new Scene(Container);
    const sceneRemoveElement = jest.spyOn(scene, 'removeElement');
    const element = new Element(new DisplayObject());

    element.scene = scene;
    element.destroy();
    expect(sceneRemoveElement).toHaveBeenCalledWith(element);
  });
});
