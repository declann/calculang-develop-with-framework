
export const x = () => (i() % num_steps()) * step_size()

export const y = () => (Math.floor(i()/num_steps())) * step_size()

export const i = () => i_in

// naive RE FP
export const num_steps = () => num_steps_in ?? 5
export const step_size = () => 1/num_steps()

export const inside = () => Math.hypot(x(), y()) < 1 ? 1 : 0;

