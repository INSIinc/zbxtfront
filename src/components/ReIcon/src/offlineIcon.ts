import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/addUser.vue 文件中加载，避免在首启动加载
 */
// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import homeRounded from "@iconify-icons/material-symbols/home-rounded";
import plan from "@iconify-icons/mdi/clipboard-text-clock";
import graph from "@iconify-icons/solar/graph-bold";
import errorRounded from "@iconify-icons/material-symbols/error-rounded";
import addCicle from "@iconify-icons/material-symbols/add-circle-rounded";
import userManage from "@iconify-icons/ic/round-supervised-user-circle";
import deleteRounded from "@iconify-icons/material-symbols/delete-rounded";
import add from "@iconify-icons/material-symbols/add";
import editRounded from "@iconify-icons/material-symbols/edit-rounded";
import statusActive from "@iconify-icons/pajamas/status-active";

addIcon("homeRounded", homeRounded);
addIcon("plan", plan);
addIcon("graph", graph);
addIcon("errorRounded", errorRounded);
addIcon("addCircle", addCicle);
addIcon("userManage", userManage);
addIcon("deleteRounded", deleteRounded);
addIcon("add", add);
addIcon("editRounded", editRounded);
addIcon("statusActive", statusActive);
