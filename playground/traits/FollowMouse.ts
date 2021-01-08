import {Trait} from '../../src';
import {EventType} from '../types';

export class FollowMouse extends Trait<EventType> {
  protected speed: number;
  protected mouseX: number;
  protected mouseY: number;

  constructor(speed: number = 5) {
    super('followMouse');
    this.speed = speed;
    this.mouseX = 0;
    this.mouseY = 0;

    const listener = (event: MouseEvent) => {
      this.mouseX = event.offsetX;
      this.mouseY = event.offsetY;
    };

    window.addEventListener('mousemove', listener);

    this.destroy = () => {
      window.removeEventListener('mousemove', listener);
    };
  }

  update(deltaTime: number): void {
    if (!this.parent) return;

    const desiredX = this.mouseX - this.parent.width / 2 - this.parent.min[0];
    const desiredY = this.mouseY - this.parent.height / 2 - this.parent.min[1];

    this.parent.velocity[0] += desiredX * this.speed - this.parent.velocity[0];
    this.parent.velocity[1] += desiredY * this.speed - this.parent.velocity[1];
  }
}
