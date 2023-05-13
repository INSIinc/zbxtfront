<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { loginRules, REGEXP_PWD } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { bg, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onBeforeUnmount, onMounted, reactive, ref, toRaw } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/material-symbols/lock-outline";
import User from "@iconify-icons/mdi/user";
import { RegisterReq, registerUser } from "@/api/user";
import { initRouter } from "@/router/utils";
import { message } from "@/utils/message";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loginLoading = ref(false);
const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();
const registerLoading = ref(false);
const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const loginForm = reactive({
  username: "",
  password: ""
});
const RegisterFormVisible = ref(false);

interface RegisterForm extends RegisterReq {
  repeatPassword: "";
}

const registerForm = reactive<RegisterForm>({
  username: "",
  password: "",
  repeatPassword: ""
});
const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: "用户名必须填写", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度需要在3~20个字符之间",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        // custom validation logic for the username field
        const validUsernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (validUsernameRegex.test(value)) {
          callback();
        } else {
          callback(new Error("用户名只能包括字母数字和下划线"));
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    { required: true, message: "请输入密码！", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为4-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  repeatPassword: [
    {
      required: true,
      message: "请再次输入密码！",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        // custom validation logic for the repeatPassword field
        if (value === registerForm.password) {
          callback();
        } else {
          callback(new Error("密码不匹配！"));
        }
      },
      trigger: "blur"
    }
  ]
});
const onRegister = async (formEl: FormInstance | undefined) => {
  console.log(formEl);
  if (!formEl) return;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      registerLoading.value = true;
      const data: RegisterReq = {
        username: registerForm.username,
        password: registerForm.password
      };
      const res = await registerUser(data);
      registerLoading.value = false;
      if (res.success) {
        ElNotification.success({
          title: "注册成功",
          message: res.data.message,
          showClose: false
        });
        RegisterFormVisible.value = false;
      } else {
        ElNotification.error({
          title: "注册失败",
          message: res.data.message,
          showClose: false
        });
      }
    }
  });
};
const onLogin = async (formEl: FormInstance | undefined) => {
  loginLoading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .loginByUsername({
          username: loginForm.username,
          password: loginForm.password
        })
        .then(res => {
          if (res.user) {
            // 获取后端路由
            initRouter().then(() => {
              router.push("/");
              message("登录成功", { type: "success" });
            });
          }
        })
        .catch(e => {
          message(e.response.data, { type: "error" });
          loginLoading.value = false;
        });
    } else {
      loginLoading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(loginFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="loginForm.username"
                  placeholder="请输入账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-2"
                size="default"
                type="primary"
                :loading="loginLoading"
                @click="onLogin(loginFormRef)"
              >
                登入系统
              </el-button>
            </Motion>
          </el-form>
          <div class="mt-4">
            <span class="text-gray-400 font-light text-xs"
              >没有账号，<span
                class="text-blue-400 hover:cursor-pointer"
                @click="RegisterFormVisible = true"
                >注册新账号</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      width="400"
      align-center
      v-model="RegisterFormVisible"
      title="注册新账号"
    >
      <el-form
        label-position="left"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
      >
        <el-form-item prop="username">
          <el-input
            :prefix-icon="useRenderIcon(User)"
            clearable
            placeholder="请输入用户名"
            v-model="registerForm.username"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            show-password
            :prefix-icon="useRenderIcon(Lock)"
            v-model="registerForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="repeatPassword">
          <el-input
            clearable
            show-password
            :prefix-icon="useRenderIcon(Lock)"
            v-model="registerForm.repeatPassword"
            placeholder="请再次输入密码"
          />
        </el-form-item>

        <el-button @click="RegisterFormVisible = false">取消</el-button>
        <el-button
          :loading="registerLoading"
          type="primary"
          @click="onRegister(registerFormRef)"
        >
          确认
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
