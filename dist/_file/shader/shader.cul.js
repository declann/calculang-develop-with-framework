// linked from README https://github.com/doxas/twigl
// by https://twitter.com/h_doxas

// next? https://twitter.com/KilledByAPixel/status/1759312124310856090

// void main(){vec4 p=vec4((gl_FragCoord.xy/4e2),0,-4);for(int i=0;i<9;++i)p+=vec4(sin(-(p.x+time*.2))+atan(p.y*p.w),cos(-p.x)+atan(p.z*p.w),cos(-(p.x+sin(time*.8)))+atan(p.z*p.w),0);gl_FragColor=p;}


export const i = () => i_in; //
export const t = () => t_in; // "time"

// FragCoord.xy
export const x = () => x_in
export const y = () => y_in

// p is (red, green, blue, w)
// (v. (x,y,z,w)) ?
export const red = () => {
  if (t() == 0)
    return x()/4e2;
  else return red({t_in:t()-1})
    + Math.sin(-(red({t_in:t()-1})+t()*.2))
    + Math.atan(green({t_in:t()-1})*w())
}

export const green = () => {
  if (t() == 0)
    return y()/4e2;
  else return green({t_in:t()-1}) + Math.cos(-red({t_in:t()-1})) + Math.atan(blue()*w({t_in:t()-1}))
};

export const blue = () =>{ 
  if (t() == 0)
    return 0;
  else return blue({t_in:t()-1}) + Math.cos(-(red({t_in:t()-1})+Math.sin(t()*.8))) + Math.atan(blue({t_in:t()-1})*w())
};
export const w = () => -4;