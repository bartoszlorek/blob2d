# User Inputs

General utilities for user interactions.

## Table of Contents

- [Keyboard](#keyboard)
- [ScreenButton](#screenbutton)

## Keyboard

Proxy of keyboard events handling both `keyup` and `keydown` state.

```ts
const keyboard = new Keyboard<TKey>();

keyboard.on('ArrowRight', (pressed: boolean) => {
  if (pressed) player.moveRight();
});

keyboard.off('ArrowRight');
keyboard.destroy(); // for a cleanup
```

## ScreenButton

Simulates clicking a physical keyboard.

```ts
const $node = document.querySelector<HTMLElement>('.button');
const button = new ScreenButton<TKey>('ArrowLeft', $node);

// extends button behavior [optional]
button.onKeydown = node => node.classList.add('clicked');
button.onKeyup = node => node.classList.remove('clicked');

// listens to the standard key event
keyboard.on('ArrowLeft', callback);
```
