import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)

export default pinia
export * from './config' //导入config.ts 也就是useConfigStore仓库，并暴露
