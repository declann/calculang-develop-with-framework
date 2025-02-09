// converted from https://frankforce.com/dissecting-a-dweet-spirograph-design-generator/

export const radius1 = () => 5*r({p_in:0})
export const radius2 = () => 9

export const x = () => x_in
export const y = () => y_in
export const t = () => t_in

// "Spirograph designs look best when the rotation parameters have a low common multiple"
export const p = () => p_in
export const r = () => Math.floor(random({p_in:p()})*20-10)


/*export const v = () => {
  if (t() == 0) return 0;
  else return v({t_in:t()-1}) + (x() == X() && Y() == Y())
}*///random({x_in:x(), y_in: y()})

export const X = () => 60+ radius1()*sin(r({p_in:1})*t()) + radius2()*sin(r({p_in:2})*t())
export const Y = () => 60+radius1()*cos(r({p_in:1})*t()) + radius2()*cos(r({p_in:2})*t())

//X = radius1*sin(turnRate1*time) + radius2*sin(turnRate2*time)


// for seeded random
import { prng_alea } from 'https://cdn.jsdelivr.net/npm/esm-seedrandom/+esm'//'https://esm.run/esm-seedrandom'
export const random_seed = () => random_seed_in;
export const seeded = () => prng_alea(random_seed());
export const random = () => seeded({ random_seed_in: random_seed() })();

const {sin, cos} = Math