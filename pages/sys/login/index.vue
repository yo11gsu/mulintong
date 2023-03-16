<template>
	<view class="wrap">
		<view style="margin-top: 100rpx;">
			<u-image src="https://mulintong.com/images/logo.png" mode="widthFix"
				style="display: flex; margin: 0 auto;width: 80%;"></u-image>
		</view>
		<div v-if="loginType === 'currentPhone'">
			<view v-if="current === 0">
				<view class="oauth2" style="margin-top: 250rpx;">
					<u-icon class="u-icon" size="100" color="#36c956" name="weixin-circle-fill" @click="authUserInfo()">
					</u-icon>
				</view>
				<view class="button" @click="authUserInfo()"><text>微信登录</text></view>
				<view class="login-bottom-box" @click="navTo('/page_login/secret')">
					登录即代表您已阅读并同意《用户协议与隐私政策》
				</view>
			</view>
		</div>
	</view>
</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
	 */
	import base64 from '@/common/base64.js';
	export default {
		data() {
			return {
				appid: '',
				openid: '',
				token: '',
				userId: '',
				user: [],
				username: '',
				loginType: 'currentPhone',
				current: 0,
				userinfo: [],
			};
		},
		onLoad() {
			this.UpdateCheck();
			this.token = '';
			this.token = uni.getStorageSync('token');
			this.wxLogin();
		},
		methods: {
			async wxLogin() {
				if (this.token == '') {
					uni.login({
						provider: 'weixin',
						success: res => {
							this.$u.api.wxLogin({
								appid: this.appid,
								code: res.code,
								token: uni.getStorageSync('token'),
							}).then(res => {
								this.token = res.data.token;
								this.openid = res.data.openid;
							})
						}
					});
				} else {
					uni.showToast({
						icon:'none',
						title:'近期你已经授权登录,自动登录中'
					})
					uni.login({
						provider: 'weixin',
						success: res => {
							this.$u.api.wxLogin({
								appid: this.appid,
								code: res.code,
								token: uni.getStorageSync('token'),
							}).then(res => {
								this.token = res.data.token;
								this.openid = res.data.openid;
								uni.setStorageSync('token', this.token);
								this.GetUserInfoByOpenid();
							})
						}
					});


				}
			},
			JudgeInfo() {
				this.$u.api.getUserVillage({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						if (res.rows.length != 0) {
							uni.reLaunch({
								url: '/pages/sys/msg/index'
							});
						} else {
							uni.navigateTo({
								url: '/page_login/InfoIniti'
							});
						}
					})
			},
			//通过openid获取用户信息
			GetUserInfoByOpenid() {
				uni.setStorageSync('token', this.token);
				this.$u.api.auth({
					openid: this.openid
				}).then(res => {
					if (res.data != null) {
						getApp().globalData.global_userId = res.data.userId;
						getApp().globalData.global_usertype = res.data.user_type;
						getApp().globalData.global_avatarUrl = res.data.avatar;
						getApp().globalData.global_ctrlCommunity = res.data.ctrlCommunity;
						getApp().globalData.global_ctrlVillage = res.data.ctrlVillage;
					}
					this.getUserInfo();
					this.JudgeInfo();
				})
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			//获取用户信息
			getUserInfo() {
				this.$u.api.getUserInfo({
						userId: getApp().globalData.global_userId,
					})
					.then(res => {
						console.log(res)
						var avatarUrl;
						if (res[0].avatar != "") {
							avatarUrl = res[0].avatar;
							this.userinfo.nickname = res[0].nick_name;
							this.postauth(avatarUrl);
						} else {
							this.postauth(this.userinfo.avatar);
						}
					})
			},
			//授权后完善用户信息
			postauth(avatar) {
				this.$u.api.postauth({
						nickname: this.userinfo.nickname,
						avatar: avatar,
						openid: this.openid,
					})
					.then(res => {
						getApp().globalData.global_avatarUrl = avatar;
					})
			},
			//授权用户
			authUserInfo() {
				uni.getUserProfile({
					desc: '登录',
					provider: 'weixin',
					lang: 'zh_CN',
					success: res => {
						uni.setStorageSync('token', this.token);
						this.userinfo = {
							nickname: res.userInfo.nickName,
							sex: res.userInfo.gender,
							avatar: res.userInfo.avatarUrl,
							city: res.userInfo.city,
						}
						this.GetUserInfoByOpenid();
					}
				})
			},
			UpdateCheck() {
				const updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});

				updateManager.onUpdateReady(function(res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});

				});

				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
				});

			},
		}
	};
</script>
<style lang="scss">
	@import 'index.scss';

	.logo {
		width: 80%;
		font-size: 64rpx;
		color: #5473e8;
		margin: 80rpx auto 80rpx auto;
	}

	.button {
		margin-top: 400rpx;
	}

	.oauth2 {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 0rpx 100rpx 30rpx;

		image {
			height: 80rpx;
			width: 80rpx;
		}
	}
</style>
