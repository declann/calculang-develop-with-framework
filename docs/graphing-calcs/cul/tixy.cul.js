
// inspired by
// https://tixi.land by Martin Kleppe https://twitter.com/aemkei

/////// swap `v` functions by flipping comments! ///////


//export const v = () => 0.05/(2-sqrt((x()-mousex())**2+(y()-mousey())**2))
//export const v = () => sqrt((x()-mousex())**2+(y()-mousey())**2)/16-0.3*mousey()/16
export const v = () => 0.8*sin(t()-sqrt(5*(x())**2 + 4*(y())**2)) // me modified from Martin (1) below
//export const v = () => 0.8*sin(t()-sqrt(5*(x()-mousex())**2 + 4*(y()-mousey())**2)) // me modified from Martin (1) below

// these nice `v` functions are migrated from tixy.land! credits at bottom.
// drag t_in slider to play animation

//export const v = () => sin(t()-sqrt((x()-7.5)**2 + (y()-6)**2)) // Martin (1)
//export const v = () => (((x()-8)/y()+t()*5)&1^1/y()*8&1)*y()/5 // (1)
//export const v = () => random({f:'0', i_in:i(),mousex_in:mousex()}) < 0.1 // Martin
//export const v = () => random({f:'1', i_in:i(),mousex_in:mousex()}) // Martin
//export const v = () => random({f:'2', i_in:i(),mousex_in:mousex()}) * (random({f:'3', i_in:i(),mousex_in:mousex()}) < 0.8 ? -1 : 1) // me!
//export const v = () => (x()-8)*(y()-8) - sin(t())*64 // (2)
//export const v = () => [1, 0, -1][i()%3] // (3) Martin
//export const v = () => ((x()^y())%2?sin:cos)(t()) // 4
//export const v = () => sin(y()/8+t()) // Martin

// next one from https://github.com/potherca-blog/tixy-tutorial/blob/main/by-example/i.md
/*
export const v = () => i() // the index ( from 0 to 255)
                          == // should match
                          ceil(t())%255 // the remainder of time (as an integer) divided by 255
                          ? -1 // If it does, make it red
                          : 1 // Otherwise, make it white
*/

//// boilerplate:

// calculang inputs:
export const t = () => t_in
export const x = () => x_in
export const y = () => y_in
export const mousex = () => mousex_in
export const mousey = () => mousey_in

// provide i and Math shortcuts:
export const i = () => y()*16+x()
const {sin, cos, /*random, use seeded random for memo*/ min, max, abs, sqrt, ceil} = Math;
// positive used to map to color channel
export const positive = () => v() >= 0;
// v_clamped used to map to size
export const v_clamped = () => min(1,abs(v()));


// now tixi.land->calculang is mostly adding brackets
// (everything in calculang is a function)



// references::

// (1)

// 3d checker board
// by Paul Malin https://twitter.com/P_Malin
//(t,i,x,y) =>
//(((x-8)/y+t*5)&1^1/y*8&1)*y/5



// (2)

// bloop bloop bloop
// by @v21

// (4)

//https://twitter.com/aemkei/status/1326637580486578177
// ((x^y)%2?sin:cos)(t)


// for seeded random
import { prng_alea } from 'https://cdn.jsdelivr.net/npm/esm-seedrandom/+esm'//'https://esm.run/esm-seedrandom'
export const random_seed = () => random_seed_in;
export const seeded = () => prng_alea(random_seed());
export const random = () => seeded({ random_seed_in: random_seed() })();