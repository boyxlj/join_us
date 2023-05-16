type TStyleConfig = {
  type:"text" | "dashed" | "outline" | "primary" | "secondary" 
  status:"normal" | "success" | "warning" | "danger"
  size:"small" | "mini" | "medium" | "large",
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
    size:'mini',
  },
  editor:{
    type:'primary',
    status:'warning',
    size:'mini',
  },
  delete:{
    type:'primary',
    status:'danger',
    size:'mini',
  },
 
}