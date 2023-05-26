export interface IStatistics {
  degreesData: IDegreesDatum[];
  companyDegreesData: IDegreesDatum[];
  companySendData: ISendDatum[];
  sendData: ISendDatum[];
  todaySend_total: number;
  position_total: number;
  send_total: number;
  hr_total: number;   //人事总数量
  companyTodaySend_total:number,
  companyPosition_total:number,
  companySend_total:number,
}

export interface ISendDatum {
  types: string;
}

export interface IDegreesDatum {
  degrees: string;
}