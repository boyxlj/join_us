import {useUserInfo} from "../store/user"
import {message,Modal } from "ant-design-vue"
import {createVNode} from  "vue"
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import router from "../router"
export const useValidateResume = (showMsg:boolean=true)=>{
  const user = useUserInfo()
  const arr = [
    'born',
    'email',
    'hope_city',
    'enter_schoolTime',
    'hope_industry',
    'hope_job',
    'hope_job_type',
    'hope_salary',
    'leave_schoolTime',
    'major',
    'name',
    'phone',
    'school',
    'school_exp',
    'school_type',
  ]
  const data = user.userInfoList[0]
  const resArr  = []
  for(let k in data){
    if(arr.includes(k)){
      if(!data[k]){
        resArr.push(false)
      }else{
        resArr.push(true)
      }
    }
  }
  const rs = resArr.every(item=>item)
  if(!rs){
    if(showMsg){
      Modal.confirm({
        centered:true,
        okText:'去完善个人信息',
        cancelText:'取消',
        title: '温馨提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '请先完善个人信息以及简历的填写',
        onOk() {
          router.push('/home/user/resume')
        },
        onCancel() {},
      });
    }
    // message.error("请先完善个人信息以及简历的填写")
  }
  return rs
}


