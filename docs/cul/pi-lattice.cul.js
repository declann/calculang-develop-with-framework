// method from https://www.geogebra.org/m/kwty4hsz
// numbers (to n=75) matching

export const n = () => n_in
export const i = () => i_in

export const x0 = () => i() % n()
export const y0 = () => Math.floor(i() / n())

export const step_size = () => 1 / n()
export const num_points = () => n() * n()

export const x = () => x0() * step_size() + step_size() / 2
export const y = () => y0() * step_size() + step_size() / 2

// count points that fall inside unit circle

// inside unit circle?
// distance to (0,0) < 1 => 1, o/w 0
export const inside = () => Math.hypot(x()-0, y()-0) < 1 ? 1 : 0;

export const count_inside_acc = () => {
  if (i() == -1) return 0
  else return count_inside_acc({ i_in: i() - 1 }) + inside()
}

export const count_inside = () => count_inside_acc({ i_in: n() * n() - 1 });

export const proportion_inside = () => count_inside() / num_points();

export const pi_approximation = () => 4 * proportion_inside();

export const error = () => Math.PI - pi_approximation();

// custom memo hash function for better perf than JSON.stringify:
export const memo_hash = ({formula, model_id, input_cursor_id, ...o}) => Object.values(o)

