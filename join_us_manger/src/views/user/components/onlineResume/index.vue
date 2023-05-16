<template>
    <div class="online-resume-container">
        <div class="userinfo-container">
            <img class="user-avatar" :src="data?.avatar" alt="">
            <div class="userinfo">
                <p style="display: flex; align-items: center;">
                    <span class="username">{{ data?.name }}</span>
                    <!-- <component :is="data.gender === '0' ? femaleIcon : maleIcon"></component> -->
                    <span class="flex-span" style="margin-left: auto;">{{ data?.age }}岁</span>
                    <span class="flex-span">{{ data?.leave_schoolTime }}</span>
                    <span class="flex-span">{{ data?.degree }}</span>
                    <span class="flex-span">{{ data?.apply_state }}</span>
                    <span class="flex-span">{{ data?.phone }}</span>
                    <span class="flex-span">{{ data?.email }}</span>
                    <!-- <span class="flex-span"><PhoneOutlined/>{{ data.phone }}</span>
                    <span class="flex-span"><MailOutlined/>{{ data.email }}</span> -->
                </p>
                <div class="user-skill">
                    <pre>
{{ data?.advantage }}
                    </pre>
                </div>
            </div>
        </div>
        <div class="hope-job">
            <p>
                <span class="title">期望职位</span>
                <span class="hope-detail">{{ data?.hope_job }}</span>
                <span class="hope-detail">{{ data?.hope_industry }}</span>
                <span class="hope-detail">{{ data?.hope_salary }}</span>
            </p>
        </div>
        <div class="job-exp">
            <span class="title">工作经历</span>
            <div class="job-exp-detail">
                <template v-for="item in data.resume" :key="item?.resume_id">
                    <p style="display: flex;">
                        <span class="job-exp-title">{{ item.company }}</span>
                        <span class="job-exp-title">{{ item.department }}-{{ item.post }}</span>
                        <span style="margin-left: auto;">{{ item.enter_time }}至{{ item.leave_time }}</span>
                    </p>
                    <div class="job-exp-content">
                        <p>工作内容:</p>
                        <pre>
{{ item?.content }}
                        </pre>
                        <a-tag :key="index" :closable="false" v-for="(item2, index) in JSON.parse(item.skill)">{{ item2 }}</a-tag>
                    </div>
                    <hr style="margin: 20px 0;">
                </template>
            </div>
        </div>
        <div class="school-exp">
            <span class="title">
                校园经历
            </span>
            <div class="school-exp-detail">
                <p style="display: flex;">
                    <span class="school-exp-tiltle">{{ data?.school }}</span>
                    <span class="school-exp-tiltle">{{ data?.major }}</span>
                    <span class="school-exp-tiltle">{{ data?.school_type }}</span>
                    <span style="margin-left: auto;">{{ data?.enter_schoolTime }}至{{ data?.leave_schoolTime }}</span>
                </p>
                <div>
                    <pre>
{{ data?.school_exp }}
                    </pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { selUserOnlineResume } from '@/api'
// import maleIcon from './components/maleIcon/index.vue'
// import femaleIcon from './components/femaleIcon/index.vue'
// import birthcakeIcon from './components/BirthCake/index.vue'
// import degreeIcon from './components/degreeIcon/index.vue'
// import stateIcon from './components/stateIcon/index.vue'
// import expIcon from './components/expIcon/index.vue'
// import { PhoneOutlined, MailOutlined } from '@ant-design/icons-vue'
const props = defineProps({
    userId: {
        type: String
    }
})
interface dataType {
    address: string,
    advantage: string,
    age: number,
    apply_state: string,
    avatar: string,
    born: string,
    degree: string,
    email: string,
    enter_schoolTime: string,
    gender: string,
    hope_city: string,
    hope_industry: string,
    hope_job: string,
    hope_job_type: string,
    hope_salary: string,
    identity: string,
    leave_schoolTime: string,
    major: string,
    name:string,
    phone: string,
    resume: [],
    school: string,
    school_exp: string,
    school_type: string
}
const propertyMap = {
    address: '地址',
    advantage: '个人优势',
    age: '年龄',
    apply_state: '是否离职',
    avatar: '头像',
    born: '出生年月',
    degree: '学历',
    email: '邮箱',
    enter_schoolTime: '入学时间',
    gender: '性别',
    hope_city: '期望城市',
    hope_industry: '期望行业',
    hope_job: '期望岗位',
    hope_job_type: '期望职位类型',
    hope_salary: '期望薪资',
    identity: '身份',
    leave_schoolTime: '毕业时间',
    major: '专业',
    name: '姓名',
    phone: '手机号',
    resume: '工作经历',
    school: '学校',
    school_exp: '在校经历',
    school_type: '学校类型'
}
const userId = computed(() => props.userId)

const data: Record<any, any> = ref({})
const getUserResume = (userId: string) => {
  if(!userId) return
  selUserOnlineResume(userId).then((res:any) => {
        console.log(res)
        data.value = res.data
    })
}
watch(userId, (newVal, oldVal) => {
  getUserResume(newVal as string)
  },
  { deep: true, immediate: true }
 )

</script>

<style lang="less" scoped>
.online-resume-container{
    width: 94%;
    min-height: 250px;
    border: 1px solid #bebebe;
    border-radius: 10px;
    padding: 25px;
    .userinfo-container{
        width: 100%;
        min-height: 150px;
        display: flex;
        .user-avatar{
            width: 80px;
            height: 100px;
            display: block;
        }
        .userinfo{
            width: calc(100% - 100px);
            margin-left: 35px;
            min-height: 150px;
            .username{
                font-size: 26px;
                font-weight: bold;
            }
            .flex-span{
                display: inline-flex;
                margin-right: 20px;
                padding-right: 20px;
                border-right: 1px solid #bebebe;
            }
            .user-skill{
                width: 100%;
                min-height: 150px;
            }
        }
        ::v-deep(.anticon){
            display: inline-flex;
            align-items: center;
        }
    }
    .hope-job{
        .title{
            display: inline-block;
            width: 80px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
        }
        .hope-detail{
            margin: 0 32px;
        }
    }
    .job-exp{
        display: flex;
        width: 95%;
        &>.title{
            display: inline-block;
            width: 84px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
        }
        .job-exp-detail{
            margin-left: 20px;
            width: calc(100% - 100px);
            min-height: 300px;
            padding: 15px;
            .job-exp-title{
                display: inline-block;
                &:first-of-type{
                    padding-right: 15px;
                    margin-right: 15px;
                    border-right: 1px solid #bebebe;
                }
            }
        }
    }
    .school-exp{
        display: flex;
        width: 95%;
        &>.title{
            display: inline-block;
            width: 80px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
        }
        .school-exp-detail{
            margin-left: 20px;
            width: calc(100% - 100px);
            min-height: 300px;
        }
        .school-exp-tiltle{
            padding-right: 20px;
            margin-right: 20px;
            border-right: 1px solid #bebebe;
        }
    }
}
</style>