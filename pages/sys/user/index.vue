<template>
	<view class="wrap">
		<view class="avatarwrap">
			<view class="status_bar">
			</view>
			<view class="avatar" @click="chooseAvatar()">
				<u-avatar size="200" :src="avatarUrl"></u-avatar>
			</view>
			<view class="avatarnickname" style="font-size: 50rpx;color: whitesmoke;">{{info.nick_name}}</view>
			<view class="status_bar">
			</view>
		</view>
		<view class="list">
			<view class="cell" @click="navTo('/page_user/info')">
				<uni-icons custom-prefix="iconfont" type="icon-Info" :size="iconSize"></uni-icons>
				<view class="cell_text">个人信息</view>
			</view>
			<view style="border-bottom: 1px solid #dedfe2;"></view>
			<view class="cell" @click="navTo('/page_user/communityinfo')">
				<uni-icons custom-prefix="iconfont" type="icon-mulin" :size="iconSize"></uni-icons>
				<view class="cell_text">睦邻信息</view>
			</view>
<!-- 			<view style="border-bottom: 1px solid #dedfe2;" class="cell" @click="navTo('/page_user/communityinfo')">
				<uni-icons custom-prefix="iconfont" type="icon-jianshezhenggai" :size="iconSize"></uni-icons>
				<view class="cell_text">随手拍整改</view>
			</view> -->
			<!-- <view class="cell" @click="navTo('')">
				<uni-icons custom-prefix="iconfont" type="icon-caozuozhinan" :size="iconSize"></uni-icons>
				<view class="cell_text">操作指南</view>
			</view> -->
		</view>
		<view class="list">
			<view class="cell" @click="navTo('/page_login/secret')">
				<uni-icons custom-prefix="iconfont" type="icon-fuwutiaokuanjiyinsi" :size="iconSize"></uni-icons>
				<view class="cell_text">隐私政策</view>
			</view>
			<view style="border-bottom: 1px solid #dedfe2;"></view>
			<view class="cell" @click="removeStorageSync()">
				<uni-icons type="refreshempty" :size="iconSize"></uni-icons>
				<view class="cell_text">清除缓存</view>
			</view>
		</view>
	</view>
</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
	 */
	export default {
		data() {
			return {
				imageValue: '',
				iconSize: 20,
				userId: '',
				userName: '',
				info: [],
				avatarUrl: '',
				currentSize: '',
				WindowWidth: '',
			};
		},
		created() {
			//更换头像
			uni.$on('uAvatarCropper', path => {
				this.avatarUrl = path;
				uni.uploadFile({
					url: this.vuex_config.baseUrl + '/common/multiPicturesUpload',
					filePath: this.avatarUrl,
					name: 'file',
					success: (uploadFileRes) => {
						this.avatarUrl = (this.vuex_config.baseUrl + JSON.parse(JSON
							.parse(JSON.stringify(uploadFileRes.data))).imgUrl)
						getApp().globalData.global_avatarUrl = this.avatarUrl;
						this.$u.api.modifyUserInfo({
								userId: getApp().globalData.global_userId,
								userName: this.info.user_name,
								sex: this.info.sex,
								phonenumber: this.info.phonenumber,
								avatar: getApp().globalData.global_avatarUrl,
							})
							.then(res => {
								if (res != 1) {
									uni.showToast({
										title: '修改失败!',
										icon: "error"
									})
								}
							})
					}
				});
			})
		},
		onLoad: function() {
			this.avatarUrl = getApp().globalData.global_avatarUrl;
			this.userId = getApp().globalData.global_userId;
			this.getSysInfo();
			this.getUserInfo();
		},
		methods: {
			//获取系统信息
			getSysInfo() {
				let sysinfo = uni.getSystemInfoSync();
				this.WindowWidth = sysinfo.windowWidth;
			},
			//裁剪头像
			chooseAvatar() {
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					params: {
						destWidth: this.WindowWidth, // 输出图片宽高
						rectWidth: (this.WindowWidth - 50), // 裁剪框的宽高
						fileType: 'jpg', // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
					}
				})
			},
			//获取用户信息
			getUserInfo() {
				this.$u.api.getUserInfo({
						userId: this.userId
					})
					.then(res => {
						this.info = res[0];
					});
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			//清楚登录token缓存
			removeStorageSync() {
				uni.clearStorage()
				uni.showToast({
					title: '清除成功!',
					icon: "success"
				})
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/sys/login/index'
					})
				}, 1500);
			},
		},
	};
</script>
<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.wrap {}

	.avatarwrap {
		background-image: url('https://mulintong.com/images/BackGroudPNG.png');
		height: 100%;
		width: 100%;
		background-size: cover;
	}

	.avatar {
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.avatarnickname {
		font-size: 50rpx;
		color: whitesmoke;
		text-align: center;
	}

	.list {
		background-color: #ffffff;
		margin: 20rpx 30rpx;
		border-radius: 20px;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
	}

	.cell {
		padding: 25rpx;
		font-size: 35rpx;
		display: flex;
		align-items: center;
	}

	.cell_text {
		margin-left: 30rpx;
	}
</style>
