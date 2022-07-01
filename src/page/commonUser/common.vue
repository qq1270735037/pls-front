<template>
	<el-container>
		<el-header>
			<el-menu :default-active="this.$router.path" class="el-menu-demo" mode="horizontal" width="80%">
				<el-menu-item index="ad">首页</el-menu-item>
				<el-menu-item index="aboutUs">关于我们</el-menu-item>
				<!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
			</el-menu>
			<button flex="right">去登录</button>
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>


</template>

<script>
	
</script>

<style>
</style>
