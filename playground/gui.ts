import {ScreenButton, Keyboard} from '../src';

export function setupGui() {
  const $button = document.querySelector<HTMLElement>('.button');

  if ($button) {
    const button = new ScreenButton('ArrowLeft', $button);
    button.onKeyup = node => node.classList.remove('button--active');
    button.onKeydown = node => node.classList.add('button--active');

    const keyboard = new Keyboard();
    keyboard.on('ArrowLeft', pressed => console.log('ArrowLeft', pressed));
  }
}
