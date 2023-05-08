export interface ICompanyData {
  id: number;
  company_id: string;
  company_name: string;
  logo: string;
  people_num: string;
  industry: string;
  financing: string;
  legal_representative: string;
  create_time: string;
  reg_city: string;
  region: string;
  capital: string;
  state: string;
  business_scope: string;
  others: string;
  addTime: string;
  position_id: string;
  position_name: string;
  salary: string;
  cityName: string;
  pos_region: string;
  experiences: string;
  degrees: string;
  position_tag: string;
  welfare_tag: string;
  hr_id: string;
  position_desc: string;
  pos_addTime: string;
  updateTime: string;
  position_state: string;
  position_type1: string;
  position_type2: string;
  job_type: string;
  
}

export interface ICompanyPositionsData  {
  id: number;
  position_id: string;
  position_name: string;
  salary: string;
  cityName: string;
  pos_region: string;
  experiences: string;
  degrees: string;
  position_tag: string;
  welfare_tag: string;
  company_id: string;
  hr_id: string;
  position_desc: string;
  pos_addTime: string;
  updateTime: string;
  position_state: string;
  position_type1: string;
  position_type2: string;
  job_type: string;
  name: string;
  telephone?: string;
  password?: string;
  avatar: string;
  reg_time: string;
  hr_identity: string;
}

//公司信息
export interface ICompanyInfo{
    id: number;
    company_id: string;
    company_name: string;
    logo: string;
    people_num: string;
    industry: string;
    financing: string;
    legal_representative: string;
    create_time: string;
    reg_city: string;
    region: string;
    detail_position: string;
    capital: string;
    state: string;
    business_scope: string;
    company_introduction: string;
    work_time: string;
    company_welfare: string;
    development: string;
    development_history: string;
    rest: string;
    others: string;
    addTime: string;
} 

//公司相册
export interface ICompanyPhoto {
  id: number;
  photo_id: string;
  hr_id: string;
  company_id: string;
  img: string;
  addTime: string;
  
}



//公司详情返回数据
export interface ICompanyDetailData {
  bossCount:number,
  positionCount:number,
  companyInfo:ICompanyInfo[],
  companyPhotos:ICompanyPhoto[],
  posData:ICompanyPositionsData[],
}