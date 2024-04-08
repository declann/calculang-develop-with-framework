// can be better structured incl. with modularity; mini-calculang doesn't support modularity atm

// moon calcs work but are really hacked in

// start copied from https://calcy-quarty-vizys-online.pages.dev/models/heavens/sunsets.cul.js

// based on formulae in SunCalc,
// https://github.com/mourner/suncalc
// by Vladimir Agafonkin (http://agafonkin.com/en)

// SunCalc readme:
// "Most calculations are based on the formulas given in the excellent Astronomy Answers articles
// about [position of the sun](http://aa.quae.nl/en/reken/zonpositie.html)
// and [the planets](http://aa.quae.nl/en/reken/hemelpositie.html)."

// ideas: compare/rec against Mike Bostock solar-calculator module on npm, and/or NOAA s/s on which solar-calculator based.
// + https://observablehq.com/@mourner/sun-position-in-900-bytes
//   ^ "more precise" "based on formulas from the 2nd edition of [Jean Meeus's "Astronomical Algorithms" book](https://www.willbell.com/math/mc1.htm)"

// sep. date/time inputs composed in date_composed - to permit separate domains for dates and time
export const date = () => date_in;
export const time = () => time_in

export const lat = () => lat_in;
export const lng = () => lng_in;

// "date/time constants and conversions"
export const dayMs = () => 1000 * 60 * 60 * 24;
export const J1970 = () => 2440588;
export const J2000 = () => 2451545;
export const rad = () => Math.PI / 180;

const { PI, sin, cos, tan, asin,
  atan2 : atan,
  acos, hypot } = Math;

export const e = () => rad() * 23.4397; // obliquity of the Earth

// used in sidereal time, but just subtracting lng directly there
//export const lw = () => rad() * -lng();
export const phi = () => rad() * lat();

export const date_composed = () => new Date(date().getFullYear(), date().getMonth(), date().getDate(), time().getHours(), time().getMinutes(), time().getSeconds())

export const julian_1 = () =>
  date_composed().valueOf() / dayMs() - 0.5 + J1970() - J2000(); // fn on date_in

//// right_ascension, declination locked input structure
export const l = () => l_in;
export const b = () => moon_b()// b_in;

export const right_ascension = () =>
  atan(sin(l()) * cos(e()) - tan(b()) * sin(e()), cos(l()));
export const declination = () =>
  asin(sin(b()) * cos(e()) + cos(b()) * sin(e()) * sin(l()));

/// azimuth, altitude ~~locked~~ input structure
//export const H = () => H_in;
//export const phi = () => phi_in;
export const dec = () => dec_in;

export const azimuth = () =>
  // based on Suncalc by Vladimir Agafonkin (http://agafonkin.com/en)
  atan(sin(H()), cos(H()) * sin(phi()) - tan(dec()) * cos(phi())); // some refactors to function might help here
export const altitude = () =>
  asin(sin(phi()) * sin(dec()) + cos(phi()) * cos(dec()) * cos(H()));

//export const lw = () => lw_in;
export const sidereal_time = () =>
  rad() * (280.16 + 360.9856235 * julian_1() + lng());

// abstract sun, moon values via obj_in
export const obj = () => obj_in;
export const mean_anomaly = () => {
  if (obj() == "sun") return rad() * (357.5291 + 0.98560028 * julian_1());
  else if (obj() == "moon") return rad() * (134.963 + 13.064993 * julian_1());
  else return console.error("obj not sun or moon"); // return here mitigates eslint error in editor
};

export const equation_of_center = () =>
  rad() *
  (1.9148 * sin(mean_anomaly()) +
    0.02 * sin(2 * mean_anomaly()) +
    0.0003 * sin(3 * mean_anomaly()));

export const perihelion_of_earth = () => rad() * 102.9372;

export const ecliptic_longitude = () => {
  if (obj() == 'sun') return PI + mean_anomaly() + equation_of_center() + perihelion_of_earth();
  else return rad() * (218.316 + 13.176396 * julian_1())
  +  (obj()=='moon' ? rad() * 6.289 * sin(mean_anomaly()) : 0) // => "lng", not "ecliptic"
}

// sunCoords outputs (still intermediate)
// naming convention? (L, 0) / _obj?
export const declination_L0 = () =>
  declination({ l_in: ecliptic_longitude(), b_in: moon_b() });
export const right_ascension_L0 = () =>
  right_ascension({ l_in: ecliptic_longitude(), b_in: moon_b()});

export const H = () => sidereal_time() - right_ascension_L0();

// outputs
export const azimuth_obj = () => azimuth({ dec_in: declination_L0() });
export const altitude_obj = () => altitude({ dec_in: declination_L0() }) + (obj() == 'moon' ? astroRefraction() : 0);

// not included above, but small
export const astroRefraction = () => {
  //return altitude_obj()
  if (altitude({ dec_in: declination_L0() }) < 0)
    return 0.0002967 / tan(0 + 0.00312536 / (0 + 0.08901179));
  // "
    // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
    // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
  // "

  else return 0.0002967 / tan(altitude({ dec_in: declination_L0() }) + 0.00312536 / (altitude({ dec_in: declination_L0() }) + 0.08901179));
}

export const moon_b = () => obj() == 'moon' ? rad() * 5.128 * sin(moon_mean_distance()) : 0

export const moon_mean_distance = () => rad()* (93.272 + 13.229350 * julian_1())

export const eclipse_guestimate = () => hypot(azimuth_obj({obj_in:'moon'})-azimuth_obj({obj_in:'sun'}), (altitude_obj({obj_in:'moon'}))-altitude_obj({obj_in:'sun'})) //< 0.01 //? 1 : 0



// to remove seasons:
// 0ize axial tilt
// then 0ize equation of center
