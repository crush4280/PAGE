<template>
  <div class="dashboard">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #409eff;">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">128</div>
            <div class="stat-label">设备总数</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>12%</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #f56c6c;">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">3</div>
            <div class="stat-label">待处理告警</div>
          </div>
          <div class="stat-trend down">
            <el-icon><Bottom /></el-icon>
            <span>2 个</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #67c23a;">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">156</div>
            <div class="stat-label">今日工单</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>8%</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #e6a23c;">
            <el-icon><Lightning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">1,234</div>
            <div class="stat-label">今日能耗 (kWh)</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>5%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>能耗趋势</span>
              <el-radio-group v-model="energyPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="能耗趋势图表区域" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>告警分布</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="告警分布图表区域" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新告警</span>
          </template>
          <el-table :data="recentAlarms" size="small">
            <el-table-column prop="title" label="告警标题" />
            <el-table-column prop="level" label="级别" width="60">
              <template #default="{ row }">
                <el-tag :type="getLevelType(row.level)" size="small">
                  {{ getLevelText(row.level) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>进行中工单</span>
          </template>
          <el-table :data="activeTickets" size="small">
            <el-table-column prop="title" label="工单标题" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const energyPeriod = ref('week')

const recentAlarms = ref([
  { id: 1, title: 'A 栋大堂摄像头离线', level: 'warning', created_at: '2026-03-12 10:30' },
  { id: 2, title: 'B 栋配电室温度过高', level: 'critical', created_at: '2026-03-12 09:15' },
  { id: 3, title: '停车场入口道闸故障', level: 'warning', created_at: '2026-03-12 08:20' }
])

const activeTickets = ref([
  { id: 1, title: 'A 栋 101 室空调不制冷', status: 'processing', created_at: '2026-03-12 09:30' },
  { id: 2, title: 'B 栋地下停车场灯光昏暗', status: 'assigned', created_at: '2026-03-12 08:45' }
])

const getLevelType = (level) => {
  const types = { info: '', warning: 'warning', critical: 'danger' }
  return types[level] || ''
}

const getLevelText = (level) => {
  const texts = { info: '提示', warning: '警告', critical: '严重' }
  return texts[level] || level
}

const getStatusType = (status) => {
  const types = { pending: '', assigned: 'warning', processing: 'primary', completed: 'success' }
  return types[status] || ''
}

const getStatusText = (status) => {
  const texts = { pending: '待处理', assigned: '已派单', processing: '处理中', completed: '已完成' }
  return texts[status] || status
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>