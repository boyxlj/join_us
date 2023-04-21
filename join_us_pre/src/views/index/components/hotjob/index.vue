<template>
    <div class="hotjob-container">
        <p class="title">热招职位</p>
        <ul class="job-type" ref="lis" @click="changeOn($event)">
            <li class="on">互联网</li>
            <li>金融</li>
            <li>娱乐传媒</li>
            <li>物流</li>
            <li>教育培训</li>
            <li>采购贸易</li>
            <li>法律咨询</li>
            <li>房地产</li>
            <li>医疗健康</li>
        </ul>
        <div class="card-container" ref="cardContainer">
            <a-card v-if="jobList.length > 0" style="width: 370px;" v-for="(item, index) in jobList" :key="item.id">
                <template #title>
                    <div class="card_title">
                        <span class="job-name">{{ item.jobName }}</span>
                        <span class="job-salary">{{ item.salary }}</span>
                    </div>
                </template>
                <span class="des">
                    {{ item.place }}
                </span>
                <span class="des">
                    {{ item.worktime }}
                </span>
                <span class="des">
                    {{ item.education }}
                </span>
                <template #actions>
                    <div style="text-align: left;">
                        <img :src="item.avatar" class="avatar" alt="">
                        <span>
                            {{ item.companyName }}
                        </span>
                    </div>
                    <div>
                        <span>
                            {{ item.jobType }}
                        </span>
                        <span>
                            不需要融资
                        </span>
                    </div>
                </template>
            </a-card>
            <p v-else>暂无职位</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { getJobList } from '@/api'
import { message } from 'ant-design-vue';
const lis = ref()
const cardContainer = ref()
interface obj {
    id: string,
    jobName: string,
    salary: string,
    place: string,
    worktime: string,
    companyName: string,
    jobType: string,
    education: string,
    avatar: string
}
const jobList = ref<Array<obj>>([])
let allJobList = ref<Array<obj>>([])
getJobList().then((res: any) => {
    allJobList.value = res.data
    let tmpArr = allJobList.value.filter(item => item.jobType === '互联网')
    res.code === 200 ? jobList.value = tmpArr : message.error('数据请求失败')
})
const changeOn = (e: any): void => {
    Array.from(lis.value.children).forEach((item: any) => {
        if (item.className.includes('on')) {
            item.classList.remove('on')
        }
    })
    e.target.classList.add('on')
    jobList.value = allJobList.value.filter(item => item.jobType === e.target.innerHTML)
}
</script>

<style lang="less" scoped>
.hotjob-container {
    width: 1200px;
    height: 1000px;
    margin: 0 auto;

    .title {
        width: 200px;
        height: 80px;
        font-size: 25px;
        font-weight: bold;
        color: var(--themeColor);
        margin: 10px auto;
        text-align: center;
        line-height: 80px;
    }

    .job-type {
        width: 1200px;
        height: 40px;
        display: flex;
        border-bottom: 1px solid #888;
        font-size: 18px;
        line-height: 40px;
        justify-content: space-evenly;
        li {
            text-align: center;
            width: 100px;

            &.on {
                border-bottom: 3px solid var(--themeColor);
            }
        }
    }

    .card-container {
        width: 1200px;
        height: 300px;
        margin: 25px auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .ant-card {
            margin: 13px;
        }

        .card_title {
            display: flex;
            justify-content: space-between;

            .job-name {
                font-weight: bold;
                font-size: 18px;
            }

            .job-salary {
                color: #fe7154;
            }
        }

        .avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
            margin-left: 10px;
        }

        .des {
            display: inline-block;
            width: 30px;
            height: 25px;
            font-size: 10px;
            text-align: center;
            line-height: 25px;
            border-radius: 5px;
            background-color: #cccaca;
            color: #000;
            margin: 0 5px;
        }
    }
}</style>