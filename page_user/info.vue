<template>
	<view class="wrap" style="padding-bottom: 60px;">
		<u-cell-group :border="false">
			<u-gap height="20" bg-color="#f5f5f5"></u-gap>
			<view style="line-height: 200rpx;border-bottom: 1px solid #dedfe2;" @click="chooseAvatar()">
				<text class="avatar" style="font-size: 30rpx;">头像</text>
				<u-avatar size="180" :src="avatarUrl" style="position: absolute;right: 10px;top:12px;" mode="square">
				</u-avatar>
			</view>
			<u-cell-item title="姓名" v-model="model.user_name" value="" :title-width="180" :arrow="false"
				@click="navTo('InfoModify?type=username')">
			</u-cell-item>
			<u-cell-item title="昵称" v-model="model.nick_name" value="" :title-width="180" :arrow="false">
			</u-cell-item>
			<view style="line-height: 54rpx;display: flex;border-bottom: 1px solid #dedfe2;">
				<text class="sex" style="font-size: 30rpx;">性别</text>
				<view style="margin-right: 32rpx;">
					<picker class="sexpicker" :range="option" :value="index" @change="sexPickerChange">
						<view class="sexcontent">{{option[index]}}</view>
					</picker>
				</view>
			</view>
			<u-cell-item title="手机" v-model="model.phonenumber" :title-width="180" :arrow="false"
				@click="navTo('InfoModify?type=phone')"></u-cell-item>
		</u-cell-group>
		<!-- <view style="margin-left: 30rpx;">
			<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model='userInfo'>
				<view style="line-height: 200rpx;border-bottom: 1px solid #dedfe2;">
					<text class="avatar" style="font-size: 30rpx;">头像</text>
					<u-avatar size="180" :src="avatarUrl" style="position: absolute;right: 10px;top:12px;" mode="square">
					</u-avatar>
				</view>
				<u-form-item label="姓名" label-width="180" prop='userName'>
					<u-input placeholder="请输入姓名" v-model="model.user_name"></u-input>
				</u-form-item>
				<u-cell-item title="昵称" v-model="model.nick_name" value="" :title-width="180" :arrow="false">
				</u-cell-item>
				<view style="line-height: 54rpx;display: flex;border-bottom: 1px solid #dedfe2;">
					<text class="sex" style="font-size: 30rpx;">性别</text>
					<view style="margin-right: 32rpx;">
						<picker class="sexpicker" :range="option" :value="index" @change="sexPickerChange">
							<view class="sexcontent">{{option[index]}}</view>
						</picker>
					</view>
				</view>
				<u-form-item label="手机号" label-width="180" prop='phoneNumber'>
					<u-input placeholder="请输入手机号" v-model="model.phonenumber" type="number"></u-input>
				</u-form-item>
			</u-form>
		</view> -->
	</view>
</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
	 */
	export default {
		data() {
			return {
				rules: {
					'userName': {
						type: 'string',
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					},
					'phoneNumber': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
				},
				index: 0,
				option: ['男', '女'],
				model: {
					sex: '0'
				},
				rules: {

				},
				userid: 1,
				avatarBase64: '',
				avatarUrl: '',
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
								userName: this.model.user_name,
								sex: this.model.sex,
								phonenumber: this.model.phonenumber,
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
		onShow() {
			this.avatarUrl = getApp().globalData.global_avatarUrl;
			this.userid = getApp().globalData.global_userId;
			this.getUserInfo();
			this.getSysInfo();
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
						userId: this.userid
					})
					.then(res => {
						this.model = res[0];
						if (res[0].sex == '2')
							this.index = 0;
						else
							this.index = res[0].sex;
					});
			},
			//性别选择器
			sexPickerChange: function(e) {
				this.index = e.detail.value;
				this.model.sex = e.detail.value;
				this.$u.api.modifyUserInfo({
						userId: getApp().globalData.global_userId,
						userName: this.model.user_name,
						sex: this.model.sex,
						phonenumber: this.model.phonenumber,
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
			},
			cancel() {
				uni.navigateBack();
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.avatar {
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: 100%;
		padding: 26rpx 32rpx;
		font-size: 28rpx;
		line-height: 200rpx;
		color: #505256;
		background-color: #fff;
		text-align: left;
	}

	.sex {
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: 100%;
		padding: 26rpx 32rpx;
		font-size: 28rpx;
		line-height: 54rpx;
		color: #505256;
		background-color: #fff;
		text-align: left;
	}

	.sexcontent {
		font-size: 35rpx;
		color: #909399;
		text-align: right;
		vertical-align: middle;
		overflow: hidden;
		line-height: 54rpx;
	}

	.sexpicker {
		margin-top: 28rpx;
	}
</style>
