<script setup>

</script>

<template>
  <div style="width: 100vw;height: 100vh;overflow: hidden;display: flex">
    <div style="flex: 1;">
      <el-image style="width: 100%;height: 100%" fit="cover"
          src="https://up.deskcity.org/pic_source/fe/6a/46/fe6a46bbcafa096d992d980c85fe46a6.jpg"/>
    </div>
    <div class="welcome-title">
      <div style="font-size: 60px;font-weight: bold;">远传抄表管理平台</div>
      <div style="margin-top: 20px">智慧水务</div>
      <div style="margin-top: 10px">远传抄表，在线查询，一站式服务</div>
    </div>
    <div class="right-card">
      <router-view/>
    </div>

  </div>

</template>

<style scoped>
.welcome-title{
  position: absolute;
  bottom: 300px;
  left: 200px;
  color: yellow;
  text-shadow: 0 0 10px black;
}
.right-card{
  width: 400px;
  z-index: 1;
  background-color: white;
}

</style>