<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2024-06-24 12:14:29
 * 佛祖保佑没bug
-->
<template>
  <div class="login_container">
    <div class="form_out">
      <div class="login_name">格灵深瞳NSR存储设备登录</div>
      <div class="login_form">
        <div
          style="height: 50px; color: #fff; width: 70%; font-family: cursive"
        >
          <span style="color: #00f6ff; font-size: 20px">用户登录</span>
          <!-- <span style="float: right; color: #409eff; font-size: 16px">
            忘记密码
          </span> -->
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForms">
          <el-form-item prop="userName">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.userName"
              clearable
              placeholder="请输入账号"
              style="width: 470px; height: 45px"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              show-password
              v-model="loginForm.password"
              size="large"
              placeholder="请输入密码"
              style="width: 470px; height: 45px"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form-item style="margin-top: 10px">
          <el-button
            :loading="loading"
            class="login_btn"
            type="primary"
            size="default"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
      </div>
    </div>
    <div class="login_right">
      <img :src="setting.loginRight" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import setting from '@/setting'
import { User, Lock } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { Md5 } from 'ts-md5'

let $router = useRouter()
let $route = useRoute()
let loading = ref(false)

let useStore = useUserStore()
let loginForms = ref()

const loginForm = reactive({
  userName: '',
  password: '',
})

const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
onMounted(() => {
  //绑定监听事件
  window.addEventListener('keydown', keyDown)
})
//点击回车键登录
const keyDown = (e: any) => {
  if (e.keyCode == 13 || e.keyCode == 100) {
    login()
  }
}
const login = async () => {
  await loginForms.value.validate()
  loading.value = true
  try {
    await useStore.userLogin({
      userName: loginForm.userName,
      password: Md5.hashStr('Deepglint' + Md5.hashStr(loginForm.password)),
    })
    let redirect: string = $route.query.redirect as string
    $router.push({ path: redirect || '/' })
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '登陆成功',
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

const rules = {
  userName: [
    {
      trigger: 'change',
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
}
</script>
<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-content: center;
  .login_right {
    position: absolute;
    right: 0;
    bottom: 0;
    // background: url('@/assets/images/login_right.jpg');
  }
  .form_out {
    width: 700px;
    height: 500px;
    position: relative;
    top: 22vh;
    background: transparent;
  }
  .login_name {
    height: 120px;
    color: rgb(0, 246, 255);
    font-size: 48px;
    font-weight: bold;
    text-align: center;
    font-family: cursive;
  }
  .login_form {
    position: relative;
    width: 677px;
    height: 423px;
    background: url('@/assets/images/login_form.png') no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .login_btn {
      width: 470px;
      height: 40px;
      border-radius: 20px;
      background-color: #01a2ad;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      font-family: PingFang SC;
    }
  }
  :deep .el-input__wrapper {
    width: 470px;
    height: 45px;
    border: 1px solid #144d91;
  }
  :deep .el-button {
    height: 40px !important;
    border-radius: 20px !important;
  }
  :deep .el-input__prefix-inner {
    color: #409eff;
  }
}
</style>
