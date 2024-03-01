// ✨ swap `v` functions by flipping comments!
// ✨ (experimental) select pieces of formulas and press F8 (not F9)

// many nice `v` functions are migrated (by adding brackets!) from tixy.land!
// thanks to Martin Kleppe twitter @aemkei and also @P_Malin and @v21

export const v = () => 0.8*sin(t()-sqrt(5*(x())**2 + 4*(y())**2))

// beating heart
//export const v = () => ((x()-8) ** 2 + ((y()-9)*-1 - Math.abs((x()-8)) ** 0.5) ** 2) /(30*sin(t()*4))&1

// here we can use mouse position::
//export const v = () => 0.05/(2-sqrt((x()-mousex())**2+(y()-mousey())**2))
//export const v = () => sqrt((x()-mousex())**2+(y()-mousey())**2)/16-0.3*mousey()/16
//export const v = () => 0.8*sin(t()-sqrt(5*(x()-mousex())**2 + 4*(y()-mousey())**2))


//export const v = () => (((x()-8)/y()+t()*5)&1^1/y()*8&1)*y()/5 // checkerboard by @P_Malin
//export const v = () => sin(t()-sqrt((x()-7.5)**2 + (y()-6)**2))

// seeded randomness; dept on mouse position:
//export const v = () => random({f:'0', i_in:i(),mousex_in:mousex()}) < 0.1
//export const v = () => random({f:'1', i_in:i(),mousex_in:mousex()})
//export const v = () => random({f:'2', i_in:i(),mousex_in:mousex()}) * (random({f:'3', i_in:i(),mousex_in:mousex()}) < 0.8 ? -1 : 1)


//export const v = () => (x()-8)*(y()-8) - sin(t())*64
//export const v = () => [1, 0, -1][i()%3]
//export const v = () => ((x()^y())%2?sin:cos)(t())
//export const v = () => sin(y()/8+t())

// last one is from Potherca & commented here: https://github.com/potherca-blog/tixy-tutorial/blob/main/by-example/i.md
//export const v = () => i() == ceil(t()) % 255 ? -1 : 1



/////// calculang boilerplate:

// calculang inputs:
export const t = () => t_in
export const x = () => x_in
export const y = () => y_in
export const mousex = () => mousex_in
export const mousey = () => mousey_in

// provide i and Math shortcuts:
export const i = () => y()*16+x()
export const {sin, cos, min, max, abs, sqrt, ceil} = Math; // MUST export for selection eval
// note: random is not Math.random, but seeded random from below

// positive is used to map to color channel; maybe more color flexibility will be interesting?
export const positive = () => v() >= 0;
// abs_v_clamped is used to map to size
export const abs_v_clamped = () => min(1,abs(v()));

// seeded random
import { prng_alea } from 'https://cdn.jsdelivr.net/npm/esm-seedrandom/+esm'
export const random_seed = () => random_seed_in;
export const seeded = () => prng_alea(random_seed());
export const random = () => seeded({ random_seed_in: random_seed() })();