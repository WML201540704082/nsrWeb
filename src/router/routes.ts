/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-28 19:11:49
 * 佛祖保佑没bug
 */
export const Route = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: 'login',
      hidden: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
    },
    redirect: '/control',
    children: [
      {
        path: '/control',
        component: () => import('@/views/control/index.vue'),
        meta: {
          title: '录像控制',
          hidden: false,
        },
      },
      {
        path: '/file',
        component: () => import('@/views/file/index.vue'),
        meta: {
          title: '录像文件',
          hidden: false,
        },
      },
      {
        path: '/system',
        component: () => import('@/views/system/index.vue'),
        meta: {
          title: '系统管理',
          hidden: false,
        },
        redirect: '/system/systemManage/network',
        children: [
          {
            path: '/system/systemManage',
            component: () => import('@/views/system/systemManage/index.vue'),
            name: 'systemManage',
            meta: {
              title: '系统管理',
              hidden: false,
            },
            children: [
              {
                path: '/system/systemManage/network',
                component: () =>
                  import('@/views/system/systemManage/network/index.vue'),
                name: 'network',
                meta: {
                  title: '网络配置',
                  hidden: false,
                },
              },
              {
                path: '/system/systemManage/iot',
                component: () =>
                  import('@/views/system/systemManage/iot/index.vue'),
                name: 'iot',
                meta: {
                  title: 'IOT平台',
                  hidden: false,
                },
              },
              {
                path: '/system/systemManage/url',
                component: () =>
                  import('@/views/system/systemManage/url/index.vue'),
                name: 'url',
                meta: {
                  title: '平台配置',
                  hidden: false,
                },
              },
              {
                path: '/system/systemManage/time',
                component: () =>
                  import('@/views/system/systemManage/time/index.vue'),
                name: 'time',
                meta: {
                  title: '时间配置',
                  hidden: false,
                },
              },
              {
                path: '/system/systemManage/file',
                component: () =>
                  import('@/views/system/systemManage/file/index.vue'),
                name: 'file',
                meta: {
                  title: '文件配置',
                  hidden: false,
                },
              },
            ],
          },
          {
            path: '/system/productMain',
            component: () => import('@/views/system/productMain/index.vue'),
            name: 'productMain',
            meta: {
              title: '产品维护',
              hidden: false,
            },
            children: [
              {
                path: '/system/productMain/zoneImport',
                component: () =>
                  import('@/views/system/productMain/zoneImport/index.vue'),
                name: 'zoneImport',
                meta: {
                  title: '区域导入',
                  hidden: false,
                },
              },
              {
                path: '/system/productMain/deviceLog',
                component: () =>
                  import('@/views/system/productMain/deviceLog/index.vue'),
                name: 'deviceLog',
                meta: {
                  title: '设备日志',
                  hidden: false,
                },
              },
              {
                path: '/system/productMain/deviceInfo',
                component: () =>
                  import('@/views/system/productMain/deviceInfo/index.vue'),
                name: 'deviceInfo',
                meta: {
                  title: '设备信息',
                  hidden: false,
                },
              },
              {
                path: '/system/productMain/deviceMain',
                component: () =>
                  import('@/views/system/productMain/deviceMain/index.vue'),
                name: 'deviceMain',
                meta: {
                  title: '设备维护',
                  hidden: false,
                },
              },
            ],
          },
          {
            path: '/system/storageMana',
            component: () => import('@/views/system/storageMana/index.vue'),
            name: 'hungry，StaytorageMana',
            meta: {
              title: '存储管理',
              hidden: false,
            },
          },
          {
            path: '/system/fullExport',
            component: () => import('@/views/system/fullExport/index.vue'),
            name: 'fullExport',
            meta: {
              title: '全盘导出',
              hidden: false,
            },
          },
        ],
      },
    ],
  },
]
