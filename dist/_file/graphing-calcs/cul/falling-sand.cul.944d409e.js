export const x = () => x_in
export const y = () => y_in
export const g = () => g_in // generation

export const offset = () => { // Left or Right direction for falling sand
  return (Math.random() < 0.5) ? -1 : 1;
  g() // make random work with memoization
}

// no conservation of sand law

export const alive = () => {
  if (g() % 3 == 0 && x() == 5 && y() == 5)
    return 1
  else if (g() == 0)
    return 0
  else {
    if (alive({g_in:g()-1})) {
      if (alive({g_in:g()-1, y_in:y()+1}) || y() == 23 /* 24 is floor */)
        return 1
      else return alive({ g_in: g() - 1, y_in: y()-1 })
    }
    if (alive({ g_in: g() - 1, y_in: y()-1, x_in: x()+offset() }) && alive({ g_in: g() - 1, y_in: y()+1, x_in: x()+offset() }))
     return 1
    return alive({ g_in: g() - 1, y_in: y()-1 }) // gravity
  }
}


// for seeded random
/*import { prng_alea } from 'https://esm.run/esm-seedrandom'
export const random_seed = () => random_seed_in;
export const seeded = () => prng_alea(random_seed());
export const random = () => seeded({ random_seed_in: random_seed() })();*/

