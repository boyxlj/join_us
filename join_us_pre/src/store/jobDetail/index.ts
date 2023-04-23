import { defineStore } from 'pinia'
import { getJobList } from '@/api'
import { message } from 'ant-design-vue'
export const jobDetailStore = defineStore('jobDetail', {
    state: () => {
        return {
            allJobList: []
        }
    },
    actions: {
        async jobListAction(){
            const res: any = await getJobList()
            if (res.code === 200) {
                this.allJobList = res.data
            } else {
                message.error('数据请求失败', 0.8)
            }
        }
    },
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
        },
      ],
    }
})
