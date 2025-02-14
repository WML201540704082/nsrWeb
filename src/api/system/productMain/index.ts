import request from '@/utils/request'
// import type { RebootType } from './type'
enum API {
  API_LOG_URL = '/web/app/log',
  API_REBOOT_URL = '/web/system/reboot',
  API_RESET_URL = '/web/system/reset',
  API_SYSTEM_INFO_URL = '/web/system/info',
  API_SYSTEM_APP_URL = '/web/system/app',
  API_SYSTEM_NAME_URL = '/web/system/name',
  API_IMPORT_URL = '/area',
}
export const querySystemName = () => {
  return request({
    url: API.API_SYSTEM_INFO_URL,
  })
}
export const putSystemName = (data: string) => {
  return request({
    url: API.API_SYSTEM_NAME_URL,
    method: 'put',
    data,
  })
}
export const querySystemInfo = () => {
  return request({
    url: API.API_SYSTEM_APP_URL,
  })
}
export const putReboot = () => {
  return request({
    url: API.API_REBOOT_URL,
    method: 'put',
  })
}
export const putReset = () => {
  return request({
    url: API.API_RESET_URL,
    method: 'put',
  })
}
export const postArea = (data: JSON) => {
  return request({
    url: API.API_IMPORT_URL,
    method: 'post',
    data,
  })
}
