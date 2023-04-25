export interface IJobType {
  children?: { name: string; id: number }[];
  name: string;
  id: string;
}
export interface Iobj {
  id: string;
  jobName: string;
  salary: string;
  place: string;
  worktime: string;
  companyName: string;
  jobType: string;
  education: string;
  avatar: string;
}




export interface IPositionType {
  position_type_id: string;
  position_type_name: string;
  children?: IPositionTypeChild[];
}

export interface IPositionTypeChild {
  id: number;
  position_type_id: string;
  type_name: string;
  parent: string;
  others: string;
  addTime: string;
}
export interface Iposition_type {
  id: number;
  position_id: string;
  position_name: string;
  salary: string;
  cityName: string;
  region: string;
  experiences: string;
  degrees: string;
  position_tag: string;
  welfare_tag: string;
  company_id: string;
  hr_id: string;
  position_desc: string;
  addTime: string;
  updateTime: string;
  position_state: string;
  position_type1: string;
  position_type2: string;
  job_type: string;
  company_name: string;
  logo: string;
  people_num: string;
  industry: string;
  financing: string;
  legal_representative: string;
  create_time: string;
  reg_city: string;
  capital: string;
  state: string;
  business_scope: string;
  others: string;
}