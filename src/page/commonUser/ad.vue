<template>
	<div>
		<el-carousel :interval="4000" type="card" height="200px">
		    <el-carousel-item v-for="item in 6" :key="item">
		      <h3 class="medium">{{ item }}</h3>
		    </el-carousel-item>
		  </el-carousel>
	</div>
</template>
<!-- url:'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg', -->
<script>
  export default {
    data() {
      return {
        url: 'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
		item:[
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
			'http://localhost:8080/2022/06/30/5de2be05-4bce-4d23-b6d3-f1f6eb097b63.jpg',
		]
      }
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
