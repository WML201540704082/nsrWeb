/*
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-24 10:24:27
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-30 14:15:18
 * 佛祖保佑没bug
 */
import request from '@/utils/request'
enum API {
  API_EXPLORER_SESSION_URL = '/web/storage/explorer/session',
  // API_EXPLORER_NOTIFY_URL = '/storage/explorer/notify',
  API_EXPLORER_URL = 'web/storage/explorer',
}
export const queryExplorerSession = (sessionId: string) => {
  return request({
    url: `${API.API_EXPLORER_SESSION_URL}/${sessionId}`,
  })
}
export const queryExplorer = () => {
  return request({
    url: API.API_EXPLORER_SESSION_URL,
  })
}
export const explorerMng = (oper: string, data: any) => {
  return request({
    url: `/${API.API_EXPLORER_URL}/${oper}`,
    method: 'post',
    data,
  })
}
