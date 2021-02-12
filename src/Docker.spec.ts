import {Application, Container} from 'pixi.js';
import {Docker} from './Docker';
import {Scene} from './Scene';

const app = new Application();

describe('class Docker', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('adds tick handler on mount', () => {
    const tickerAdd = jest.spyOn(app.ticker, 'add');
    const docker = new Docker(app);
    const scene = new Scene(Container);

    docker.mount(scene);
    expect(tickerAdd).toHaveBeenCalledWith(expect.any(Function), docker);
  });

  it('removes tick handler on unmount', () => {
    const tickerRemove = jest.spyOn(app.ticker, 'remove');
    const docker = new Docker(app);
    const scene = new Scene(Container);

    docker.mount(scene);
    docker.unmount();
    expect(tickerRemove).toHaveBeenCalledWith(expect.any(Function), docker);
  });

  it('adds scene graphics to stage on mount', () => {
    const stageAddChild = jest.spyOn(app.stage, 'addChild');
    const docker = new Docker(app);
    const scene = new Scene(Container);

    docker.mount(scene);
    expect(stageAddChild).toHaveBeenCalledWith(scene.graphics);
  });

  it('removes scene graphics from stage on unmount', () => {
    const stageRemoveChild = jest.spyOn(app.stage, 'removeChild');
    const docker = new Docker(app);
    const scene = new Scene(Container);

    docker.mount(scene);
    docker.unmount();
    expect(stageRemoveChild).toHaveBeenCalledWith(scene.graphics);
  });

  it('emits scene event on mount', () => {
    const docker = new Docker(app);
    const scene = new Scene(Container);
    const sceneEmit = jest.spyOn(scene, 'emit');

    docker.mount(scene);
    expect(sceneEmit).toHaveBeenCalledWith('mount', scene);
  });

  it('emits scene event on unmount', () => {
    const docker = new Docker(app);
    const scene = new Scene(Container);
    const sceneEmit = jest.spyOn(scene, 'emit');

    docker.mount(scene);
    docker.unmount();
    expect(sceneEmit).toHaveBeenCalledWith('unmount', scene);
  });

  it('destroys scene on unmount', () => {
    const docker = new Docker(app);
    const scene = new Scene(Container);
    const sceneDestroy = jest.spyOn(scene, 'destroy');

    docker.mount(scene);
    docker.unmount();
    expect(sceneDestroy).toHaveBeenCalledTimes(1);
  });

  it('unmounts old scene when mounts new one', () => {
    const stageRemoveChild = jest.spyOn(app.stage, 'removeChild');
    const docker = new Docker(app);
    const scene1 = new Scene(Container);
    const scene2 = new Scene(Container);

    docker.mount(scene1);
    docker.mount(scene2);
    expect(stageRemoveChild).toHaveBeenCalledWith(scene1.graphics);
  });
});
