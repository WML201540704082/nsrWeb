export function resizeWindow() {
  let screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  let screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  let zoom = screenWidth / 1920
  document.body.style.setProperty('--screenHeight', screenHeight + 'px')
  document.body.style.setProperty('--clientHeight', screenHeight - 64 + 'px')
  document.body.style.setProperty('--zoom', zoom + '')
  console.log('zoom11111', screenWidth, zoom, screenHeight)
  return
}

//文件大小转化，以.5为分界转化
//1TB=1024GB 1GB=1024MB 1MB=1024KB 1KB=1024B
export function transformSize(size: string | number, type = 'B'): string {
  if (!size) return ''
  let nextType = ''
  switch (type) {
    case 'B':
      nextType = 'KB'
      break
    case 'KB':
      nextType = 'MB'
      break
    case 'MB':
      nextType = 'GB'
      break
    case 'GB':
      nextType = 'TB'
      break
    default:
      break
  }
  if (Number(size) > 512) {
    return transformSize((Number(size) / 1024).toFixed(2), nextType)
  }
  return size + type
}

//录像文件页面数据保存
export function storageModel(type: string, savModel?: any) {
  //如果savmodel有值代表存
  if (savModel) {
    window.sessionStorage.setItem(type, JSON.stringify(savModel))
  } else {
    let res = JSON.parse(window.sessionStorage.getItem(type) || '{}')
    window.sessionStorage.removeItem(type)
    return res
  }
}
