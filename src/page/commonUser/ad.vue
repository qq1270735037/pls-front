<template>
  <div>
    <el-container style="height: 500px">
      <el-header style="background-color:#f1eeec">
        <el-menu  style="margin-right: 10px;background-color: rgb(241,238,236)"
            :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item
              style="margin-left: 1000px"index="1"> 首页
          </el-menu-item>
          <el-menu-item index="2" >关于我们</el-menu-item>
          <el-menu-item
              index="3"><a href="https://www.ele.me" target="_blank">去登陆</a></el-menu-item>
        </el-menu>
<!--        <div class="line"></div>-->
<!--        <el-menu style="background-color: white"-->
<!--            :default-active="activeIndex2"-->
<!--            class="el-menu-demo"-->
<!--            mode="horizontal"-->
<!--            @select="handleSelect"-->
<!--            background-color="#545c64"-->
<!--            text-color="#fff"-->
<!--            active-text-color="#ffd04b">-->
<!--          <el-menu-item index="1">处理中心</el-menu-item>-->
<!--          <el-submenu index="2">-->
<!--            <template slot="title">我的工作台</template>-->
<!--            <el-menu-item index="2-1">选项1</el-menu-item>-->
<!--            <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--            <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--            <el-submenu index="2-4">-->
<!--              <template slot="title">选项4</template>-->
<!--              <el-menu-item index="2-4-1">选项1</el-menu-item>-->
<!--              <el-menu-item index="2-4-2">选项2</el-menu-item>-->
<!--              <el-menu-item index="2-4-3">选项3</el-menu-item>-->
<!--            </el-submenu>-->
<!--          </el-submenu>-->
<!--          <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
<!--          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
<!--        </el-menu>-->
      </el-header>
      <el-main>
        <el-carousel :interval="4000" type="card" height="400px" >
          <el-carousel-item v-for="item in adList" :key="item">
            <img v-if="item.adImages" :src="item.adImages" >
          </el-carousel-item>
        </el-carousel>
      </el-main>
      <el-footer >
        <br>欢迎来到攀枝花物流公司
      </el-footer>
    </el-container>

  </div>

</template>

<script>
import {queryByPage } from '@/api/getAd';
import { setStorage, getStorage} from "@/utils/localStorage.js";
import request from "@/utils/request";
import {Message} from "element-ui";
export default {
  data() {
    return {
      adList:[],       //存储表单内容
    }
  },
  methods: {
    //初始化表格
    initAdList2(){
      queryByPage({}).then((res)=>{
        console.log(res)
        if(res != -1){
          res.datas.forEach((item, index) => {
            //通过页数计算index
            // item.index= (this.listQuery.page-1) * this.listQuery.limit+index+1;
            item.index = index + 1;
          })
          this.adList =res.datas
        }

      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initAdList2();
    })
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>