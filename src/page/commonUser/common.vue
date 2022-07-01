<template>
	<el-container>
		<el-header>
			<el-menu :default-active="this.$router.path" class="el-menu-demo" mode="horizontal" width="100px">
				<el-menu-item index="ad">首页</el-menu-item>
				<el-menu-item index="aboutUs">关于我们</el-menu-item>
				<el-menu-item index="login" style="margin-left: 80%;">去登录</el-menu-item>
			</el-menu>
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
