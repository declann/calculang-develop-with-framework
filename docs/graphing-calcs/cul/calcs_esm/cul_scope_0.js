export const x = ({ x_in }) => x_in;
export const n = ({ n_in }) => n_in;
export const radius = ({ radius_in }) => radius_in;

export const line = ({ x_in }) => Math.abs(x({ x_in }));

export const wave = ({ x_in, n_in }) => Math.sin(x({ x_in }) * n({ n_in }));

export const semi_circle = ({ x_in, radius_in }) => {
  if (Math.abs(x({ x_in })) > radius({ radius_in })) return 0;else
  return (radius({ radius_in }) ** 2 - x({ x_in }) ** 2) ** 0.5;
};

export const result = ({ x_in, radius_in, n_in }) => line({ x_in }) + semi_circle({ x_in, radius_in }) * wave({ x_in, n_in });

// source maps don't work; not serving the resource

//# sourceMappingURL=cul_scope_0.js.map