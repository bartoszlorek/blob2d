import {Entity} from './Entity';
import {Trait} from './Trait';

class TestTrait<A, T, E extends string> extends Trait<A, T, E> {}

describe('class Trait', () => {
  it('constructs with an empty entity', () => {
    const trait = new TestTrait();

    expect(trait.entity).toBe(Entity.EMPTY);
  });
});
