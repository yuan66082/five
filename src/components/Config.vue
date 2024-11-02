<script lang="ts" setup>
import { ref } from 'vue';
import { CircleCloseFilled,Setting } from '@element-plus/icons-vue';
import { useConfigStore } from '../stores'
const config = useConfigStore()
// 定义抽屉的开合
const visible = ref(true)

</script>
<template>
    <div>
        <el-button :icon="Setting" type="success" size="small" circle  @click="visible = true" style="position:fixed;right:10px;top:10px;" />
        <el-drawer 
        v-model="visible" 
        :show-close="false" 
        :lock-scroll="false"
        :modal="true"
        size="20%"
        >
            <template #header="{ close, titleId, titleClass }">
              <h4 :id="titleId" :class="titleClass">设置</h4>
              <el-button :icon="CircleCloseFilled" type="danger" size="small" circle @click="visible = false" />
            </template>
            <div>
                <el-text class="mx-1" type="warning">棋盘大小</el-text>
                <el-input-number
                v-model="config.board_size"
                :min="10"
                :max="30"
                @change="$router.go(0)"
                >
                <template #prefix>
                    <span></span>
                  </template>
                </el-input-number>
            </div>
            <div>
                <el-text class="mx-1" type="warning">赢棋所需连子</el-text>
                <el-input-number
                v-model="config.win_count"
                :min="3"
                :max="30"
                @change="$router.go(0)"
                >
                <template #prefix>
                    <span></span>
                  </template>
                </el-input-number>
            </div>
            
          </el-drawer>
 
    </div>
</template>
<style scoped></style>