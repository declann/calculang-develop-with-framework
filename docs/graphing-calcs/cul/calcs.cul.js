export const x = () => x_in;
export const n = () => n_in
export const radius = () => radius_in

export const line = () => Math.abs(x());

export const wave = () => Math.sin(x() * n());

export const semi_circle = () => {
  if (Math.abs(x()) > radius()) return 0;
  else return (radius() ** 2 - x() ** 2) ** 0.5;
};

export const result = () => line() + semi_circle() * wave()