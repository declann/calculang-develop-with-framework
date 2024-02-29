// some variable names and other logic corresponds closely to the following C code:
// https://gist.github.com/Joker-vD/cc5372a349559b9d1a3b220d5eaf2b01

import { range } from 'https://cdn.jsdelivr.net/npm/underscore/+esm'//'https://esm.run/underscore';

// calculang inputs:
export const WIDTH = () => WIDTH_in;
export const HEIGHT = () => HEIGHT_in;

export const x = () => x_in;
export const y = () => y_in

// each i we generate new caves which we either accept or reject depending if they fit
// (criteria in accept formula)
export const i = () => i_in;

// the randomness approach is not ergonomic; but it is pure
// in calculang we need to guarantee purity; but predictability follows

// random dimensions of a cave: each i a new cave (these random calls to ensure purity)
// width, height, left and top are all inner dimensions/coordinates (w/o walls)
export const width = () => Math.floor(random({ f: 'w', i_in: i() }) * 10) + 5 // from [5..14] range
export const height = () => Math.floor(random({ f: 'h', i_in: i() }) * 6) + 3 // from [3..8] range
export const left = () => 1 + Math.floor(random({ f: 'l', i_in: i() }) * (WIDTH() - width() - 2))
export const top = () => 1 + Math.floor(random({ f: 't', i_in: i() }) * (HEIGHT() - height() - 2))

// convenience, for easy visual as rect marks (left->x2, top->y2):
export const x2 = () => left() + width()
export const y2 = () => top() + height()

// cave-level calcs (by i):

// we might accept or reject a given cave
export const accept = () => {
  if (i() == 0) return 1 // the initial generated cave always a keeper (sorry for pun)
  // this is where most caves get excluded:
  if (door_candidates().length == 0) return 0 // no potential door=> not a valid cave to include
  // now it just depends if there are overlapping floors:
  if (floor_overlap() == 0) return 1
  else return 0;
}

// convenience tile constants
const TILE_VOID = ' '
const TILE_FLOOR = '.'
const TILE_WALL = '#'
const TILE_CORNER = '!'
const TILE_OPEN_DOOR = '\''
const TILE_CLOSED_DOOR = '+'
const TILE_PLAYER = '🦸'//'@'

// I can refactor to use x2, y2
export const atHorizontalWall = () => (y() == top() || y() == top() + height()) && x().between(left() - 1, left() + width() + 1)

export const atVerticalWall = () => (x() == left() || x() == left() + width()) && y().between(top() - 1, top() + height() + 1);

// in proposed cave dimensions (inclusive) is there overlap against existing floors tiles? (yes => reject)
export const floor_overlap = () =>
  range(left(), x2() + 1).reduce((acc, x_in) =>
    acc + range(top(), y2() + 1).reduce((acc, y_in) =>
      acc + (FIELD({ i_in: i() - 1 }) == TILE_FLOOR) // this might miss something?
    , 0)
  , 0)

// like doorCounter in C version
export const door_candidates = () =>
  range(left(), x2()+1).map(x_in =>
    range(top(), y2()+1).map(y_in =>
      ({x_in, y_in, doorOption: (FIELD({ i_in: i() - 1 }) == TILE_WALL) * (proposed_tiles() != TILE_CORNER)})
    )
  ).flat().filter(d => d.doorOption != 0)

// type is {x_in, y_in, doorOption} (or undefined)
export const door = () => door_candidates()[Math.floor(random({ f: 'door', i_in }) * door_candidates().length)]

// tiles for proposed cave; including random mobs and cash but still likely to be rejected
export const proposed_tiles = () => {
  if (atHorizontalWall() && atVerticalWall())
    return TILE_CORNER;
  else if (atHorizontalWall() || atVerticalWall())
    return TILE_WALL;
  else if (x().between(left(), left() + width()) && y().between(top(), top() + height()))
    if (i() == 0 || (random({f: 'stuff', x_in, y_in, i_in})) > 0.05)
      return TILE_FLOOR
    else return (random({f: 'stuff2', x_in, y_in, i_in}) < 0.5) ? '💰' : (['👾','👹'][Math.floor(random({f: 'mobs', x_in, y_in, i_in})*2)])
  else return TILE_VOID;
}

// random player start position inside generated dimensions for initial cave ({i_in:0})
export const player_x = () => Math.floor(random({f: 'player x'}) * (width({i_in:0})-2)) + left({i_in:0}) + 1;
export const player_y = () => Math.floor(random({f: 'player y'}) * (height({i_in:0})-2)) + top({i_in:0}) + 1;

// this is the generated dungeon (for iteration i)
export const FIELD = () => {
  if (i() == -1) return TILE_VOID;
  if (i() == 0) {
    if (x() == player_x() && y() == player_y()) return TILE_PLAYER;
  }
  if (accept()) {
    if (door() != undefined) if (x() == door().x_in && y() == door().y_in) return random({f: 'door type', i_in}) > 0.5 ? TILE_OPEN_DOOR : TILE_CLOSED_DOOR
    return proposed_tiles() == TILE_VOID ? FIELD({ i_in: i() - 1 }) : proposed_tiles()
  }
  else return FIELD({ i_in: i() - 1 })
}

// convenience things:

// modified from https://stackoverflow.com/a/18881828
Number.prototype.between = function (a, b) {
  return this > Math.min(a, b) && this < Math.max(a, b);
};

// for seeded random
import { prng_alea } from 'https://cdn.jsdelivr.net/npm/esm-seedrandom/+esm'//'https://esm.run/esm-seedrandom'
export const random_seed = () => random_seed_in;
export const seeded = () => prng_alea(random_seed());
export const random = () => seeded({ random_seed_in: random_seed() })();