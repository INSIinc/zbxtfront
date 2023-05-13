<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { ref } from "vue";

defineOptions({
  name: "UserList"
});
const username = ref(useUserStore().username);
console.log(username.value);
</script>

<template>
  <div class="grid grid-cols-5 p-2 gap-8">
    <div
      v-for="i in 15"
      :key="i"
      class="flex-col col-span-1 shadow justify-start items-center rounded bg-white dark:bg-neutral-900"
    >
      <div class="flex-col p-2">
        <div class="justify-center flex">
          <img
            class="rounded-full"
            src="https://pic1.zhimg.com/v2-71024a9b53d35ba27a6e9484316dc292_xl.jpg"
            alt="头像正在加载"
            style="width: 3em; height: 3em"
          />
        </div>
        <div class="mx-2 justify-center flex">
          {{ username }}
        </div>
      </div>
      <div class="border-b border-gray-200" />
      <div class="flex justify-between items-center p-2">
        <el-tooltip content="编辑信息" placement="bottom">
          <div
            class="rounded-full mx-1 flex justify-center items-center hover:border-gray-400 transition-all border-gray-200 border hover:cursor-pointer"
            style="width: 2em; height: 2em"
          >
            <iconify-icon-offline class="text-gray-400" icon="editRounded" />
          </div>
        </el-tooltip>
        <el-tooltip content="是否激活用户" placement="bottom">
          <div
            class="rounded-full mx-1 border border-gray-200 flex justify-center hover:border-green-400 items-center hover:cursor-pointer"
            style="width: 2em; height: 2em"
          >
            <iconify-icon-offline
              class="text-green-400"
              icon="statusActive"
              style="width: 0.6em"
            />
          </div>
        </el-tooltip>
        <el-tooltip content="删除用户" placement="bottom">
          <div
            class="rounded-full mx-1 border hover:border-red-400 border-gray-200 flex justify-center items-center hover:cursor-pointer"
            style="width: 2em; height: 2em"
          >
            <iconify-icon-offline class="text-red-400" icon="deleteRounded" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
