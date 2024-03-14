
export const semi_circle = () => {
  if (Math.abs(x()-cx()) > r()) return NaN;
  else return (r() ** 2 - (x()-cx()) ** 2) ** 0.5;
};

export const a1 = () => radius()-semi_circle({cx_in:bend_start(), r_in:radius()})

export const a2 = () => -radius()+h()+semi_circle({cx_in:centerX(), r_in:radius()})

export const a3 = () => radius()-semi_circle({cx_in:rightX(), r_in:radius()})

export const rightX = () => centerX() + 2*radius()*sin(bend_angle())
//this.rightX = this.centerX + 2 * this.arcRadius * Math.sin(this.arcAngle);


export const t = () => t_in

export const carx = () => {
  if (t() == 0) return 1;
  else return carx({t_in:t()-1})+ car_speed()*cos(car_angle())
}

export const cary0 = () => cary0_in ?? 0
export const car_speed = () => car_speed_in ?? 0.1

export const cary = () => {
  if (t() == 0) return cary0();
  else return cary({t_in:t()-1})+ car_speed()*sin(car_angle())
}

export const car_angle_0 = () => car_angle_0_in ?? 0

export const car_turning_rate = () => car_turning_rate_in ?? 0.1

export const car_angle = () => {
  if(t() == 0) return car_angle_0()
  if (car_offroad({t_in:t()-1})) return car_angle({t_in:t()-1})+car_turning_rate()*(car_offset({t_in:t()-1}) > 0 ? -1 : 1)
   //return car_angle({t_in:t()-1}) + 0.01 * (offset({x_in:carx(), y_in:cary()}) > 0)
  
  return car_angle({t_in:t()-1})
}

export const car_offroad = () => 
  offroad({x_in: carx(), y_in:cary()})
export const car_offset = () => 
  offset({x_in: carx(), y_in:cary()})


export const dx = () => x() - bend_start()
export const dy = () => y()-radius()
export const y = () => y_in

export const road_width = () => 1//road_width_in ?? 2

export const road2 = () => road() + road_width()/2
export const roadm2 = () => road() - road_width()/2

export const road = () => {
  if (x() <= bend_start() || x() >= rightX()) return 0;
  else if (bend_center_range()) return a2() // BUG this is flawed !!! I need to project bend_center_range to y=0; probably a bad approach !!
  else if (x() < centerX()) return a1()
  else return a3()
}

export const bend_center_range = () => {
  return Math.abs(Math.atan2(x()-centerX(),y()-(-radius()+h())))<bend_angle() 
}

export const offset = () => {
  if (x() <= bend_start() || x() >= rightX()) return y();
  else if (bend_center_range()) return hypot(x()-centerX(),y()-(-radius()+h())) - radius()
  else if (x() < centerX()) return radius()-hypot(x()-bend_start(),y()-(radius())) //+ radius()
  else return radius()-hypot(x()-rightX(),y()-(radius())) //+ radius()
}

export const offroad = () => Math.abs(offset())>road_width() ? 1 : 0

export const centerX = () => bend_start() + 2*radius() * sin(bend_angle())
//         this.centerX = this.leftX + 2 * this.arcRadius * Math.sin(this.arcAngle);

export const r = () => r_in
export const cy = () => cy_in
export const h = () => h_in ?? 5
export const bend_start = () => bend_start_in ?? 4
export const x = () => x_in;
export const radius = () => 0.5*h()/(1-cos(bend_angle()))
export const bend_angle = () => bend_angle_in ?? PI/2-0.01
// (0.5 * (this.lowY - this.highY) / (1 - Math.cos(this.arcAngle)));

export const cx = () => cx_in

const { cos, sin, PI, tan, hypot } = Math;

// custom memo hash function:
export const memo_hash = JSON.stringify//({formula, model_id, input_cursor_id, ...o}) => Object.values(o)

