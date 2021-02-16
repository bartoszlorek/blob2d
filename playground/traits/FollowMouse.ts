import {ICamera, Trait} from 'blob2d';
import {Addons, Events, Traits} from '../types';

export class FollowMouse extends Trait<Addons, Traits, Events> {
  protected speed: number;
  protected mouseX: number;
  protected mouseY: number;

  constructor(speed: number = 5, camera: ICamera) {
    super();

    this.speed = speed;
    this.mouseX = 0;
    this.mouseY = 0;

    const listener = (event: MouseEvent) => {
      this.mouseX = event.clientX - camera.offsetX;
      this.mouseY = event.clientY - camera.offsetY;
    };

    window.addEventListener('mousemove', listener);

    this.destroy = () => {
      window.removeEventListener('mousemove', listener);
    };
  }

  update(deltaTime: number) {
    const desiredX = this.mouseX - this.entity.width / 2 - this.entity.min[0];
    const desiredY = this.mouseY - this.entity.height / 2 - this.entity.min[1];

    this.entity.velocity[0] += desiredX * this.speed - this.entity.velocity[0];
    this.entity.velocity[1] += desiredY * this.speed - this.entity.velocity[1];
  }
}
