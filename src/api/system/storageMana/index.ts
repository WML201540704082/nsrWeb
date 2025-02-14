import request from '@/utils/request'
enum API {
  API_RECORD_STORAGE_URL = '/web/record/storage',
  API_RECORD_URL = '/record',
}
export const queryRecordStorage = () => {
  return request({
    url: API.API_RECORD_STORAGE_URL,
  })
}
export const deleteRecordStorage = (data: any) => {
  return request({
    url: API.API_RECORD_URL,
    method: 'delete',
    data,
  })
}
