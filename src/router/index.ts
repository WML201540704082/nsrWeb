/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-13 09:36:35
 * @LastEditors: wml
 * @LastEditTime: 2023-11-13 15:08:39
 * 佛祖保佑没bug
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { Route } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: Route,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
