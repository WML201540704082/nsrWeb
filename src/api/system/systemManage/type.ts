/*
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-24 10:23:20
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-27 18:44:58
 * 佛祖保佑没bug
 */
export interface NetworkType {
  dev: string
  dns: string[]
  gateway: string
  ip: string
  netmask: string
}
export interface DateTimeType {
  unixSec: any
  ntp: boolean
  ntpServer: string
}
