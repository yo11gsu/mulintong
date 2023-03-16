<script>
/**
 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
 */
export default {
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	onLaunch() {
		// this.globalData.goEasy = this.goEasy;
		console.log('App Launch');
		//设置全局变量
		globalData:{
			global_userId:'1'
			global_usertype:'00'
			global_avatarUrl:''
			global_ctrlCommunity:''  //物业管理社区
			global_ctrlVillage:''   //物业管理小区
		};
		
		// 国际化，设置当前语言
		if (this.vuex_locale){
			this.$i18n.locale = this.vuex_locale;
			this.$u.api.lang({lang: this.vuex_locale});
		}
		// 设置底部导航栏角标
		uni.setTabBarBadge({
		  index: 0,
		  text: '3'
		});
		// uni.removeTabBarBadge({
		//   index: 0
		// });
	}
}
</script>
<style>
	@import url("~@/static/iconfont/iconfont.css");
	@import url('./static/style/chatInterface.css');
</style>
<style lang="scss">
@import "uview-ui/index.scss";
@import "pages/common/aidex.scss";
@import "@/static/iconfont.css";
</style>