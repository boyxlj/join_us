export interface IJobType {
  children?: { name: string; id: number }[];
  name: string;
  id: string;
}
export interface obj {
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
  children: IPositionTypeChild[];
}

export interface IPositionTypeChild {
  id: number;
  position_type_id: string;
  type_name: string;
  parent: string;
  others: string;
  addTime: string;
}