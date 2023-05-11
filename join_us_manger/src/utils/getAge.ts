export const getAge = (val:string)=>{
  const preYear =new Date().getFullYear()
  const born = val?.split('-')[0]  as any
  const res = preYear - born
  return res>0?res:1
}