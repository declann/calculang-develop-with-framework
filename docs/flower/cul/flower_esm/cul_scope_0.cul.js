// based on awesome "Painting with Maths in Google Sheets" by Inigo Quilez (https://iquilezles.org/)
// https://www.youtube.com/watch?v=JnCkF62gkOY
// his Google doc visual:
// https://docs.google.com/spreadsheets/d/1zPtl4DpFRb-RANetrK4RrgSH-nuttDo6FdSgNiViKic/edit#gid=794943047

// I migrated his formula(!) with very minor changes into result formula below
// and then I split it into different meaningful bits
// (petals, head, face) so I can visualize them seperately as I want.
// I made some petal features customizable by inputs.
// I also changed the eyes to be a composition of every high-schoolers equation of a circle (not smooth like everything else, but ok)

export const petals = () =>
  min(
    1,
    max(
      0,
      20 +
        petal_size() *
          (0.5 +
            0.5 * cos(petal_num() * atan2(column() - 50.5, row() - 50.5))) **
            petals_roundy_spikiness() -
        sqrt((column() - 50.5) ** 2 + (row() - 50.5) ** 2)
    )
  );

export const head = () =>
  min(1, max(0, 19 - sqrt((column() - 50.5) ** 2 + (row() - 50.5) ** 2)));

export const circle = () => // used with inputs r_in, x0_in, y0_in below
  (column() - x0()) ** 2 + (row() - y0()) ** 2 < r() ** 2;

// I refactored eyes to use a circle function
// I lost some smoothness but I gained some freaky eyes
export const face_eyes = () =>
  2 *
  (circle({ r_in: 4, x0_in: 45, y0_in: 45 }) -
    circle({ r_in: 2, x0_in: 45, y0_in: 45 + 1 }) +
    circle({ r_in: 4, x0_in: 55, y0_in: 45 }) -
    circle({ r_in: 2, x0_in: 55, y0_in: 45 + 1 }));

export const face_mouth = () =>
  2 *
  min(1, max(0, row() - 50.5)) *
  min(
    1,
    max(0, 2 - abs(8 - sqrt((column() - 50.5) ** 2 + (row() - 50.5) ** 2)))
  );

export const face = () => face_eyes() + face_mouth();

export const result = () => petals() + head() + face();

// just convenience stuff:
let cos = Math.cos;
let sqrt = Math.sqrt;
let abs = Math.abs;
let atan2 = Math.atan2;
let min = Math.min;
let max = Math.max;

// inputs:
export const row = () => row_in;
export const column = () => column_in;

export const petal_size = () => petal_size_in;
export const petal_num = () => petal_num_in;
export const petals_roundy_spikiness = () => petals_roundy_spikiness_in;

// for circle
export const x0 = () => x0_in;
export const y0 = () => y0_in;
export const r = () => r_in;