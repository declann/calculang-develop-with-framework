
export const x = ({ x_in }) => x_in;
export const n = ({ n_in }) => n_in;

export const line = ({ x_in }) => Math.abs(x({ x_in }));

export const sin = ({ x_in, n_in }) => Math.sin(x({ x_in }) * n({ n_in }));