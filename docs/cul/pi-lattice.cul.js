// method from https://www.geogebra.org/m/kwty4hsz
// numbers (to n=75) matching

export const x0 = () => ((i()) % (n()))
export const y0 = () => (Math.floor(i()/n()))

export const x = () => x0() * step_size()+step_size()/2
export const y = () => y0() * step_size()+step_size()/2
export const step_size = () => 1/(n())

/* this convergence is poor:
export const x = () => x0() * step_size()
export const y = () => y0() * step_size()
export const step_size = () => 1/(n()-1)*/


export const i = () => i_in

// naive RE FP?
export const n = () => n_in ?? 11

export const inclusive = () => inclusive_in ?? false

export const inside = () => {
  if (inclusive())
    return Math.hypot(x(), y()) <= 1 ? 1 : 0;
  return Math.hypot(x(), y()) < 1 ? 1 : 0;
}

export const count_inside_acc = () => {
  //for (let i2_in=0;i2_in++<i();inside({i_in:i2_in}));
  if (i() == -1) return 0
  else return count_inside_acc({i_in:i()-1})+inside()
}

export const count_inside = () => count_inside_acc({i_in: n()*n()-1});

export const points = () => n()*n()

export const pi_approximation = () => 4*count_inside()/points();
