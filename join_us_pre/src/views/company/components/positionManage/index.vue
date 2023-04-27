<template>
    <a-button @click="addPosition" type="primary" style="margin: 10px 0; width: 250px; font-weight: bold;">
        <template #icon>
            <PlusSquareOutlined />
        </template>
        发布职位
    </a-button>
    <div class="position-manage-container">
        <a-table bordered :data-source="positionList" :pagination="false" :columns="columns">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'position_state'">
                    <span>
                        <a-tag color="warning" v-if="record.position_state === '0'">待审核</a-tag>
                        <a-tag color="success" v-else-if="record.position_state === '1'">正常</a-tag>
                        <a-tag color="error" v-else>已关闭</a-tag>
                    </span>
                </template>
                <template v-if="column.key === 'oprate'">
                    <a-button @click="lookDetail(record.position_id)" style="font-size: 14px; margin-bottom: 5px;"
                        type="primary" size="small">
                        <template #icon>
                            <EyeOutlined />
                        </template>
                        查看
                    </a-button>
                    <br>
                    <a-button style="font-size: 14px; margin-bottom: 5px;" type="primary" size="small">
                        <template #icon>
                            <EditOutlined />
                        </template>
                        编辑
                    </a-button>
                    <br>
                    <a-button style="font-size: 14px; margin-bottom: 5px;" type="primary" size="small">
                        <template #icon>
                            <DeleteOutlined />
                        </template>
                        删除
                    </a-button>
                </template>
            </template>
        </a-table>
        <a-pagination style="margin-top: 20px;" @change="changePage" :pageSize="pageSize" v-model:current="pageIndex"
            :total="total" show-less-items />
    </div>
    <a-modal style="width: 1200px;" ok-text="确认" cancel-text="关闭" v-model:visible="detailVisible" title="职位详情" @ok="detailVisible = false">
        <a-descriptions bordered title="职位详情">
            <a-descriptions-item label="职位名称">{{ positionDetailObj.position_name }}</a-descriptions-item>
            <a-descriptions-item label="职位薪资">{{ positionDetailObj.salary }}</a-descriptions-item>
            <a-descriptions-item label="发布城市">{{ positionDetailObj.cityName }}</a-descriptions-item>
            <a-descriptions-item label="经验要求">{{ positionDetailObj.experiences }}</a-descriptions-item>
            <a-descriptions-item label="学历要求">{{ positionDetailObj.degrees }}</a-descriptions-item>
            <a-descriptions-item label="招聘类型">{{ positionDetailObj.job_type }}</a-descriptions-item>
            <a-descriptions-item label="所属公司">{{ positionDetailObj.company_name }}</a-descriptions-item>
            <a-descriptions-item label="发布hr">{{ positionDetailObj.name }}</a-descriptions-item>
            <a-descriptions-item label="hr联系方式">{{ positionDetailObj.telephone }}</a-descriptions-item>
            <a-descriptions-item label="职位标签">
                <a-tag color="#7546C9" v-for="(item, index) in positionDetailObj.position_tag" :key="index">{{ item
                }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="福利标签">
                <a-tag color="#7546C9" v-for="(item, index) in positionDetailObj.welfare_tag" :key="index">{{ item
                }}</a-tag>
            </a-descriptions-item>
        </a-descriptions>
    </a-modal>
    <a-modal style="width: 900px;" ok-text="确认" cancel-text="关闭" v-model:visible="addVisible" title="发布职位" @ok="addVisible = false">
        123
    </a-modal>
</template>

<script setup lang="ts">
import { hrPositionManage, hrPositionDetail, hrAddPosition } from '@/api'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons-vue'
interface position {
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
}
const propertyMap: Record<string, string> = {
    position_name: '职位名称',
    salary: '薪资',
    cityName: '发布城市',
    pos_region: '发布区域',
    experiences: '经验要求',
    degrees: '学历要求',
    pos_addTime: '发布时间',
    updateTime: '最近更新时间',
    position_state: '职位状态',
    job_type: '职位招聘类型',
    oprate: '操作'
}
const columns = ref<any[]>([])
const positionList = ref<position[]>([])
const pageIndex = ref(1)
const pageSize = ref(5)
const total = ref(0)
const positionDetailObj: any = ref({})
const gwzz = ref<HTMLElement>()
hrPositionManage(localStorage.getItem('company_id') as string, pageIndex.value, pageSize.value).then((res: any) => {
    columns.value = Object.keys(propertyMap).map((item, index) => {
        return {
            title: propertyMap[item],
            dataIndex: item,
            key: item
        }
    })
    const tmpArr = res.data.map((item: position) => {
        return {
            position_name: item.position_name,
            salary: item.salary,
            cityName: item.cityName,
            pos_region: item.pos_region,
            experiences: item.experiences,
            degrees: item.degrees,
            pos_addTime: item.pos_addTime,
            updateTime: item.updateTime,
            position_state: item.position_state,
            job_type: item.job_type,
            oprate: '',
            position_id: item.position_id
        }
    })
    positionList.value = tmpArr
    total.value = res.total
})
const detailVisible = ref(false)
const addVisible = ref(false)
const changePage = (page: number) => {
    console.log(page)
    pageIndex.value = page
    hrPositionManage(localStorage.getItem('company_id') as string, pageIndex.value, pageSize.value)
}
const lookDetail = (position_id: string) => {
    detailVisible.value = true
    hrPositionDetail(position_id).then((res: any) => {
        if (res.code === 200) {
            positionDetailObj.value = res.data
        }
    })
}

const addPosition = () => {
    addVisible.value = true
    const company_id = localStorage.getItem('company_id') as string
    const telephone = JSON.parse(localStorage.getItem('loginInfo') as string).telephone
    console.log(company_id, telephone);
    hrAddPosition({ company_id: company_id, telephone: telephone }).then(res => {
        console.log(res);
    })
}
</script>

<style lang="less" scoped></style>