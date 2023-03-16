<template>
	<view class="wrap">
		<view v-if="type=='username'" style="border-bottom: 1px solid #dedfe2;">
			<uni-easyinput v-model="userinfo.user_name" focus placeholder="请输入姓名" :inputBorder="false"
				@change="submit()"></uni-easyinput>

		</view>
		<view v-if="type=='phone'" style="border-bottom: 1px solid #dedfe2;">
			<uni-easyinput v-model="userinfo.phonenumber" focus placeholder="请输入电话号码" type="number" @change="submit()" maxlength="11"
				@input="phoneChange()" :inputBorder="false"></uni-easyinput>
		</view>
		<view style="color: red;margin-left: 20rpx;" v-if="phoneWrong==true">请输入正确的手机号码！</view>
		<view class="button" @click="submit()" style="margin-top: 500rpx;"><text>提交</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneWrong: false,
				type: '',
				userinfo: [],
				sex: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '未知',
					value: 2
				}],
			}
		},
		onLoad(option) {
			this.type = option.type;
			this.setTitle(option);
			this.getuserInfo();
		},
		methods: {
			submit() {
				if (this.userinfo.phonenumber.length == 11) {
					this.$u.api.modifyUserInfo({
							userId: getApp().globalData.global_userId,
							userName: this.userinfo.user_name,
							sex: this.userinfo.sex,
							phonenumber: this.userinfo.phonenumber,
							avatar: getApp().globalData.global_avatarUrl,
						})
						.then(res => {
							if (res == 1) {
								{
									uni.showToast({
										title: "修改成功!",
										icon: "success"
									})
								}
							} else {
								uni.showToast({
									title: '修改失败!',
									icon: "error"
								})
							}
						})
				}else{
					
				}
			},
			change(e) {
				console.log('e:', e.detail.data.value);
			},
			getuserInfo() {
				this.$u.api.getUserInfo({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						this.userinfo = res[0];
					});
			},
			phoneChange() {
				console.log(this.userinfo.phonenumber.length)
				if (this.userinfo.phonenumber.length != 11)
					this.phoneWrong = true
				else this.phoneWrong = false
			},
			setTitle(option) {
				if (option.type == 'username') {
					uni.setNavigationBarTitle({
						title: '设置名字'
					})
				} else if (option.type == 'nickname') {
					uni.setNavigationBarTitle({
						title: '设置昵称'
					})
				} else if (option.type == 'sex') {
					uni.setNavigationBarTitle({
						title: '设置性别'
					})
				} else if (option.type == 'phone') {
					uni.setNavigationBarTitle({
						title: '设置手机号'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.uni-list-cell {
		justify-content: flex-start
	}

	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.button {
		color: #ffffff;
		font-size: 32rpx;
		width: 80%;
		height: 80rpx;
		background: #497bff;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(15, 168, 250, 0.4);
		border-radius: 10rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 50rpx auto 0;
	}
</style>
