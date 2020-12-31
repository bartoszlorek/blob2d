// @flow strict

import {Global, Scene} from '../src';

class Level extends Scene<mixed> {
  update(deltaFrame) {
    // console.log({deltaFrame});
  }
}

const game = new Global({
  backgroundColor: 0x161e21,
});

const level = new Level();

game.mount(level);
