export const g = () => g_in; // generation
export const size = () => size_in;
export const x = () => x_in;
export const y = () => y_in;

export const initial_grid_function = () => initial_grid_function_in;

export const alive = () => {
  // edges never alive
  if (x() == -1 || x() == size() || y() == -1 || y() == size())
    return 0

  // initial grid
  if (g() == 0)
    return initial_grid_function()()[y()][x()];

  if (alive({ g_in: g() - 1 })) {
    switch (neighbours_alive({ g_in: g() - 1 })) {
      case 2:
      case 3:
        return 1;
      default:
        return 0;
    }
  } else {
    if (neighbours_alive({ g_in: g() - 1 }) == 3)
      return 1;
    else return 0;
  }
};

export const neighbours_alive = () =>
  // vs. reduce over neighbours?
  alive({ x_in: x() - 1, y_in: y() - 1 }) +
  alive({ x_in: x(), y_in: y() - 1, }) +
  alive({ x_in: x() - 1, y_in: y(), }) +
  alive({ x_in: x() + 1, y_in: y(), }) +
  alive({ x_in: x() + 1, y_in: y() - 1, }) +
  alive({ x_in: x() - 1, y_in: y() + 1, }) +
  alive({ x_in: x(), y_in: y() + 1, }) +
  alive({ x_in: x() + 1, y_in: y() + 1, });
