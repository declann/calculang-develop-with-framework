export const mrr_cf = () => {
  if (month() == -1) return 0;
  else return mrr() * Math.exp(month() * mrr_growth());
}

export const vc_cf = () => {
  if (month() == 3) return vc_1();
  if (month() == 11) return vc_2();
  else return 0;
};

export const rent_cf = () => {
  if (month() == -1) return 0; // => rent_cf now dept on month
  else return -rent();
}

export const employees = () => {
  if (month() == -1) return 0;
  if (month() == 0) return employees_0();
  else return employees({ month_in: month() - 1 }) + new_employees_per_month();
};


export const payroll_cf = () => -salary_per_employee() * employees();

export const total_cf = () => mrr_cf() + rent_cf() + vc_cf() + payroll_cf();

export const npv = () => {
  if (month() >= last_month()) return 0;
  return (
    (npv({ month_in: month() + 1 }) + total_cf({ month_in: month() + 1 })) /
    (1 + npv_i())
  );
};

export const answer = () => npv({month_in:-1})//total_cf()//npv()



// inputs:
export const mrr = () => mrr_in ?? 155000;
export const month = () => month_in ?? -1;
export const mrr_growth = () => mrr_growth_in ?? 0.15;
export const vc_1 = () => vc_1_in ?? 1000000;
export const vc_2 = () => vc_2_in ?? 2000000;
export const rent = () => rent_in ?? 200000;
export const employees_0 = () => employees_0_in ?? 26;
export const new_employees_per_month = () => new_employees_per_month_in ?? 2;
export const salary_per_employee = () => salary_per_employee_in ?? 15000;
export const last_month = () => last_month_in ?? 17;
export const npv_i = () => npv_i_in ?? 0;