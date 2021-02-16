import {Keyboard, ScreenButton} from 'blob2d';

export function setupGui() {
  const $button = document.querySelector<HTMLElement>('.button');

  if ($button) {
    const button = new ScreenButton('ArrowLeft', $button);
    button.onKeyup = node => node.classList.remove('button--clicked');
    button.onKeydown = node => node.classList.add('button--clicked');

    const keyboard = new Keyboard();
    keyboard.on('ArrowLeft', pressed => console.log('ArrowLeft', pressed));
  }
}
