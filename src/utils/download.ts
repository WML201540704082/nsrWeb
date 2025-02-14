/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-27 12:18:10
 * @LastEditors: wml
 * @LastEditTime: 2023-11-27 14:10:25
 * 佛祖保佑没bug
 */
//将base64转换为blob
const dataURLtoBlob = function (base64: string): Blob {
  const byteString = atob(base64.split(',')[1])
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}
export { dataURLtoBlob }
