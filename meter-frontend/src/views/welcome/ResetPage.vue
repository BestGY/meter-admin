<script setup>
import {computed, reactive, ref} from "vue";
import {EditPen, Lock, Message} from "@element-plus/icons-vue";
import {get, post} from "@/net";
import {ElMessage} from "element-plus";
import router from "@/router";

const active = ref(0)

const coldTime = ref(0)
const formRef = ref()
const form = reactive({
  email:'',
  code: '',
  password: '',
  password_repeat: ''
})

const validatePassword= (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password){
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur'},
    { type: 'email', message: '请输入合法邮箱', trigger: ['blur', 'change']}
  ],
  code: [
    { required: true, message: '请输入获取的验证码', trigger: 'blur'}
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur'},
    { min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: ['blur', 'change']}
  ],
  password_repeat: [
    {validator: validatePassword, trigger: ['blur', 'change']}
  ]

}

function askCode() {
  if(isEmailValid){
    coldTime.value= 600
    get(`/api/auth/ask-code?email=${form.email}&type=register`, () => {
      ElMessage.success(`验证码已经发送到邮箱： ${form.email}, 请注意查收`)
      setInterval(() => coldTime.value--, 1000)
    }, (message) => {
      coldTime.value = 0
      ElMessage.warning(message)
    })
  } else {
    ElMessage.warning("请输入正确的电子邮件")
  }
}
const isEmailValid = computed(() => /^\w+@\w+(\.\w+)+$/.test(form.email))

function confirmReset(){
  formRef.value.validate((valid) => {
    if (valid) {
      post('/api/auth/rest-confirm', {
        email: form.email,
        code: form.code
      }, () => active.value++)
    }
  })
}

function doReset(){
  formRef.value.validate((valid) => {
    if (valid) {
      post('/api/auth/rest-password', {...form}, () => {
        ElMessage.success('密码重置成功，请重新登录')
        router.push('/')
      })
    }
  })
}
</script>

<template>
  <div style="text-align: center">
    <div style="margin-top: 30px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="验证电子邮件"/>
        <el-step title="重新设置密码"/>
      </el-steps>
    </div>
    <div style="margin: 0 20px" v-if="active === 0">
      <div style="margin-top: 80px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey ">请输入需要重置密码的电子邮件地址</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="email">
            <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
              <template #prefix>
                <el-icon><Message/></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="20" style="width: 100%;">
              <el-col :span="17">
                <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                  <template #prefix>
                    <el-icon><EditPen /></el-icon>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-button @click="askCode" :disabled="!isEmailValid || coldTime > 0" type="success">
                  {{ coldTime > 0 ? `请稍后 ${coldTime} 喵` : '获取验证码'}}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 80px">
        <el-button @click="confirmReset" style="width: 250px" type="warning" plain>开始重置密码</el-button>
      </div>
    </div>
    <div style="margin: 0 20px" v-if="active ===1">
      <div style="margin-top: 80px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey ">请输入您的新密码</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" maxlength="20" placeholder="密码">
              <template #prefix>
                <el-icon><Lock/></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_repeat">
            <el-input v-model="form.password_repeat" type="password" maxlength="20" placeholder="重复密码">
              <template #prefix>
                <el-icon><Lock/></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 80px">
        <el-button @click="doReset" style="width: 250px" type="warning" plain>立即重置密码</el-button>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>