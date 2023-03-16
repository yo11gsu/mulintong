<template>
	<view class="wrap">
		<view class="" style="display: flex;">
			<picker @change="change" :value="index" :range="VillageData" style="margin: 0 auto;">
				<view class="VillagePicker" style="font-size: 40rpx;">
					<text>{{VillageData[index]}}</text>
				</view>
			</picker>
		</view>
		<view>
			<uni-card v-for="(chat,index) in chatlist" :title="chat.roomTitle" :key="index" :extra="village"
				shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)" :border="false"
				thumbnail="https://mulintong.com/images/chat.png" spacing="10rpx" padding="20rpx" margin="30rpx 20rpx"
				@click="navTo('/page_chat/Detail?roomId='+chat.roomId)">
				<view class="body"
					style="display: flex;font-size: 35rpx;flex-direction: row; justify-content: center;align-items: center;">
					<view style="flex-direction: row; justify-content: center;align-items: center;display: flex;">
						<image style="width: 50rpx;height: 50rpx;" src="https://mulintong.com/images/chatstarttime.png">
						</image>
						<view style="margin-left: 10rpx;">{{chat.startTime}}</view>
					</view>
					<view style="margin-left: auto;display: flex;">
						<view style="margin-right: 20rpx;">进入议事</view>
						<uni-icons custom-prefix="iconfont" type="icon-jinru" size="20"></uni-icons>
					</view>
				</view>
			</uni-card>
		</view>
		<!-- <view class="btn-plus" @click="navTo('/page_chat/Add')">
			<u-icon name="plus-circle-fill" size="60" color="#3d87ff"></u-icon>
		</view> -->
		<view style="margin-top: 40rpx;">
			<u-loadmore status="nomore" />
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
				nomore: 'nomore',
				ex: '标题',
				index: 0,
				village: '',
				userId: '1',
				chatlist: [],
				VillageData: [],
				Firstnews: '',
				roomId: 1,
				userInfo: {},
				imgUrl: '',
			};
		},
		onTabItemTap() {
			this.imgUrl = getApp().globalData.global_avatarUrl;
			this.userId = getApp().globalData.global_userId;
			this.getUserVillage()
		},
		onLoad: function(option) {
			this.imgUrl = getApp().globalData.global_avatarUrl;
			this.userId = getApp().globalData.global_userId;
			this.getUserVillage()
		},
		methods: {
			getUserVillage() {
				this.$u.api.getUserVillage({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						this.VillageData = res.rows
						this.village = this.VillageData[0];
						this.index = 0;
						this.getList();
					})
			},
			/** 查询议事列表 **/
			async getList() {
				await this.$u.api.chatList({
						village: this.village
					})
					.then(res => {
						this.chatlist = res;
						this.roomId = res.roomId;
						this.getUserInfo();
					})
			},
			//查询用户信息
			getUserInfo() {
				this.$u.api.chatUserInfo({
						userId: this.userId,
						village: this.village
					})
					.then(res => {
						this.userInfo = res[0];
						let user = {
							uuid: this.userId,
							name: this.userInfo.userName,
							avatar: this.imgUrl,
							village: this.village
						};
						uni.setStorageSync('currentUser', user);
					})
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},

			change: function(e) {
				this.index = e.detail.value;
				this.village = this.VillageData[this.index];
				this.getList();
				let user = {
					uuid: this.userId,
					name: this.userInfo.userName,
					avatar: this.imgUrl,
					village: this.village
				};
				uni.setStorageSync('currentUser', user);
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.VillagePicker {
		height: 50rpx;
		padding: 15rpx 25rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		background: #FFF;
		flex: 1;
	}
</style>
