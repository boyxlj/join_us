<template>
    <a-button @click="editOrAddPosition()" type="primary" style="margin: 10px 0; width: 250px; font-weight: bold;">
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
                    <a-button @click="editOrAddPosition(record.position_id)" style="font-size: 14px; margin-bottom: 5px;" type="primary" size="small">
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
    <a-modal style="width: 1200px;" ok-text="确认" cancel-text="关闭" v-model:visible="detailVisible" title="职位详情"
        @ok="detailVisible = false">
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
    <a-modal style="width: 900px;" ok-text="确认" cancel-text="关闭" v-model:visible="addVisible" title="职位信息填写"
        @ok="addPositionHandle">
        <a-form :rules="rulesRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="职位名称" name="position_name">
                <a-input v-model:value="formState.position_name" />
            </a-form-item>
            <a-form-item label="职位薪资" name="salary">
                <a-input v-model:value="formState.salary" />
            </a-form-item>
            <a-form-item label="发布城市" name="city">
                <a-cascader v-model:value="formState.cityArr" :options="cityList"
                    :field-names="{ label: 'name', value: 'name', children: 'subLevelModelList' }"
                    placeholder="请选择职位发布城市" />
            </a-form-item>
            <a-form-item label="职位分类" name="position_type">
                    <a-cascader v-model:value="formState.position_type" :options="positionTypeListCom"
                        :field-names="{ label: 'position_type_name', value: 'position_type_id', children: 'children' }"
                        placeholder="请选择职位分类" />
                </a-form-item>
            <a-form-item label="工作经验" name="experiences">
                <a-input v-model:value="formState.experiences" />
            </a-form-item>
            <a-form-item label="学历要求" name="position_name">
                <a-select v-model:value="formState.degrees">
                    <a-select-option v-for="(item, index) in degreesArr" :key="index" :value="item.value">{{ item.name
                    }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="福利待遇" name="welfare_tag">
                <a-input v-model:value="formState.welfare_tag" placeholder="请填写福利待遇，每项福利待遇间以英文逗号分隔" />
            </a-form-item>
            <a-form-item label="岗位描述" name="position_desc">
                <a-textarea v-model:value="formState.position_desc" showCount :rows="4" placeholder="请填写岗位描述" />
            </a-form-item>
            <a-form-item label="招聘类型" name="job_type">
                <a-select v-model:value="formState.job_type">
                    <a-select-option v-for="(item, index) in job_typeArr" :key="index" :value="item.value">{{ item.name
                    }}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { hrPositionManage, hrPositionDetail, hrAddPosition } from '@/api'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons-vue'
import { Form, message } from 'ant-design-vue'
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
interface formType {
    position_name: string,
    salary: string,
    cityArr: string[],
    experiences: string,
    degrees: string,
    welfare_tag: string,
    position_desc: string,
    job_type: string,
    position_type: [],
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
const pageSize = ref(3)
const total = ref(0)
const positionDetailObj: any = ref({})
const cityList = ref(JSON.parse(localStorage.getItem('cities') as string).allCityList)
const degreesArr = ref([
    {
        name: '中专/中技',
        value: '中专/中技',
    },
    {
        name: '高中',
        value: '高中',
    },
    {
        name: '本科',
        value: '本科',
    },
    {
        name: '大专',
        value: '大专',
    },
    {
        name: '硕士',
        value: '硕士',
    },
    {
        name: '博士',
        value: '博士',
    },
    {
        name: '初中及以下',
        value: '初中及以下',
    },
    {
        name: '学历不限',
        value: '学历不限',
    }
])
const job_typeArr = ref([
    {
        name: '全职',
        value: '全职'
    },
    {
        name: '兼职',
        value: '兼职'
    },
    {
        name: '实习',
        value: '实习'
    },
    {
        name: '校招',
        value: '校招'
    }
])
const positionTypeList = ref(JSON.parse(localStorage.getItem('positionType') as string).positionTypeList)
const positionTypeListCom = computed(() => {
    const resultArr = positionTypeList.value.map((item: any) => {
        return {
            position_type_name: item.position_type_name,
            position_type_id: item.position_type_id,
            children: []
        }
    })
    const secondArr: [] = positionTypeList.value.map((item: any) => item.children).flat(Infinity).map((item: any) => {
        return {
            position_type_id: item.position_type_id,
            position_type_name: item.type_name,
            parent: item.parent
        }
    })
    secondArr.forEach((item: any) => {
        if (resultArr.findIndex((item2: any) => item2.position_type_id === item.parent) !== -1) {
            resultArr[resultArr.findIndex((item2: any) => item2.position_type_id === item.parent)].children.push(item)
        }
    })
    return resultArr
})
const useForm = Form.useForm
const formState = reactive<formType>({
    position_name: '',
    salary: '',
    cityArr: [],
    experiences: '',
    degrees: '',
    welfare_tag: '',
    position_desc: '',
    job_type: '',
    position_type: []
})
const rulesRef = reactive({
    position_name: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    salary: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    cityArr: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    experiences: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    degrees: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    welfare_tag: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    position_desc: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    job_type: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    position_type1: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }],
    position_type2: [{ required: true, message: '该字段不能为空!', trigger: 'blur' }]
})
const { validate } = useForm(formState, rulesRef)
const getDetail = () => {
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
}
getDetail()
const detailVisible = ref(false)
const addVisible = ref(false)
const btnText = ref('')
// 切换页数
const changePage = (page: number) => {
    console.log(page)
    pageIndex.value = page
    getDetail()
}
// 查看详情
const lookDetail = (position_id: string) => {
    detailVisible.value = true
    hrPositionDetail(position_id).then((res: any) => {
        if (res.code === 200) {
            positionDetailObj.value = res.data
        }
    })
}
// 发布职位
const addPositionHandle = async () => {
    if (btnText.value === 'edit') {
        addVisible.value = false
    } else {
        await validate()
        const company_id = localStorage.getItem('company_id') as string
        const telephone = JSON.parse(localStorage.getItem('loginInfo') as string).telephone
        hrAddPosition({ company_id: company_id, telephone: telephone, formData: formState }).then((res: any) => {
            if (res.code === 200) {
                message.success(res.msg)
                addVisible.value = false
                getDetail()
            } else {
                message.warn(res.msg)
                addVisible.value = false
                getDetail()
            }
            addVisible.value = false
        })
    }
}
const editOrAddPosition = (position_id?: string) => {
    addVisible.value = true
    if (position_id) {
        btnText.value = 'edit'
    } else {
        btnText.value = 'add'
    }
}
</script>

<style lang="less" scoped></style>