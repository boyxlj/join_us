type TStyleConfig = {
  type:"text" | "dashed" | "outline" | "primary" | "secondary" 
  status:"normal" | "success" | "warning" | "danger"
}

type TBtnStyle = {
  editor:TStyleConfig,
  select:TStyleConfig,
  delete:TStyleConfig,
}



export const btnStyle:TBtnStyle = {
  select:{
    type:'primary',
    status:'normal',
  },
  editor:{
    type:'primary',
    status:'warning',
  },
  delete:{
    type:'primary',
    status:'danger',
  },
}