<template>
  <div>
    <el-container style="height: 500px">
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