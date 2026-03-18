<template>
  <div class="devices-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备列表</span>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            新增设备
          </el-button>
        </div>
      </template>

      <!-- 筛选区 -->
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="设备类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable>
            <el-option label="摄像头" value="camera" />
            <el-option label="门禁" value="door" />
            <el-option label="传感器" value="sensor" />
            <el-option label="电表" value="meter" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="故障" value="error" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadDevices">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="devices" v-loading="loading" stripe>
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ getDeviceType(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="building" label="楼栋" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        class="mt-4"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑设备' : '新增设备'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择设备类型">
            <el-option label="摄像头" value="camera" />
            <el-option label="门禁" value="door" />
            <el-option label="传感器" value="sensor" />
            <el-option label="电表" value="meter" />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入安装位置" />
        </el-form-item>
        <el-form-item label="所属楼栋">
          <el-input v-model="form.building" placeholder="请输入楼栋" />
        </el-form-item>
        <el-form-item label="楼层">
          <el-input-number v-model="form.floor" :min="-5" :max="100" />
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入设备描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const filterForm = reactive({
  type: '',
  status: ''
})

const formRef = ref(null)
const form = reactive({
  name: '',
  type: '',
  location: '',
  building: '',
  floor: null,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }]
}

const devices = ref([
  { id: 'dev-001', name: 'A 栋大堂摄像头', type: 'camera', location: 'A 栋 1 层大堂', building: 'A 栋', floor: 1, status: 'online' },
  { id: 'dev-002', name: 'B 栋门禁', type: 'door', location: 'B 栋 1 层大厅', building: 'B 栋', floor: 1, status: 'online' },
  { id: 'dev-003', name: '温湿度传感器-A1', type: 'sensor', location: 'A 栋 1 层会议室', building: 'A 栋', floor: 1, status: 'online' }
])

const DEVICE_TYPES = {
  camera: '摄像头',
  door: '门禁',
  sensor: '传感器',
  meter: '电表',
  light: '灯控',
  ac: '空调'
}

const STATUS_MAP = {
  online: { type: 'success', text: '在线' },
  offline: { type: 'info', text: '离线' },
  error: { type: 'danger', text: '故障' }
}

const getDeviceType = (type) => DEVICE_TYPES[type] || type
const getStatusType = (status) => STATUS_MAP[status]?.type || ''
const getStatusText = (status) => STATUS_MAP[status]?.text || status

const loadDevices = () => {
  loading.value = true
  // TODO: 调用 API
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetFilter = () => {
  filterForm.type = ''
  filterForm.status = ''
  loadDevices()
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    name: '',
    type: '',
    location: '',
    building: '',
    floor: null,
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
    type: 'warning'
  }).then(() => {
    // TODO: 调用 API
    ElMessage.success('删除成功')
    loadDevices()
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用 API
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadDevices()
    }
  })
}

onMounted(() => {
  loadDevices()
})
</script>

<style scoped>
.devices-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}
</style>