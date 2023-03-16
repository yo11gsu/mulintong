<template>
	<view class="wrap">
		<view class="" style="display: flex;">
			<picker @change="change" :value="index" :range="VillageData" style="margin: 0 auto;">
				<view class="VillagePicker">
					<text>{{VillageData[index]}}</text>
				</view>
			</picker>
		</view>
		<view class="img" style="margin-top: 30rpx;">
			<u-image src="https://mulintong.com/images/news.png" mode="widthFix"></u-image>
		</view>
		<!-- <view style="margin-top: 20rpx;">
			<u-swiper :list="swiperImg" :effect3d="true" img-mode="aspectFit"></u-swiper>
		</view> -->
		<view style="padding: 20rpx;">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button"
				activeColor="#007aff"></uni-segmented-control>
		</view>
		<view v-show="current === 0">
			<view>
				<uni-card v-for="(news,i) in newslist" :key="i" :title="news.notice_title" :extra="news.create_time"
					v-if="news.notice_type=='1'" shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)" :border="false"
					spacing="10rpx" padding="20rpx" margin="30rpx 20rpx"
					thumbnail="https://mulintong.com/images/tongzhi.png">
					<view class="body" style="display: flex;font-size: 30rpx;">
						<text @click="navTo('/page_msg/newsDetail?noticeId='+news.notice_id)">查看详情>></text>
						<text style="margin-left: auto;">{{news.village}}</text>
					</view>
				</uni-card>
			</view>
		</view>
		<view v-show="current === 1">
			<view>
				<uni-card v-for="(news,i) in newslist" :key="i" :title="news.notice_title" :extra="news.create_time"
					v-if="news.notice_type=='2'" shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)" :border="false"
					spacing="10rpx" padding="20rpx" margin="30rpx 20rpx"
					thumbnail="https://mulintong.com/images/gonggao.png">
					<view class="body" style="display: flex;font-size: 30rpx;">
						<text @click="navTo('/page_msg/newsDetail?noticeId='+news.notice_id)">查看详情>></text>
						<text style="margin-left: auto;">{{news.village}}</text>
					</view>
				</uni-card>
			</view>
		</view>
		<view v-show="current === 2">
			<view>
				<uni-card v-for="(news,i) in newslist" :key="i" :title="news.notice_title" :extra="news.create_time"
					v-if="news.notice_type=='3'" shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)" :border="false"
					spacing="10rpx" padding="20rpx" margin="30rpx 20rpx"
					thumbnail="https://mulintong.com/images/pingjia.png">
					<view class="body" style="display: flex;font-size: 30rpx;">
						<text @click="navTo('/page_msg/newsDetail?noticeId='+news.notice_id)">查看详情>></text>
						<text style="margin-left: auto;">{{news.village}}</text>
					</view>
				</uni-card>
			</view>
		</view>
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
				swiperImg: [{
					image: 'https://mulintong.com/images/news.png'
				}, {
					image: 'https://mulintong.com/images/news.png'
				}, {
					image: 'https://mulintong.com/images/news.png'
				}],
				index: 0,
				keywords: '',
				village: '',
				userId: '1',
				newslist: [],
				VillageData: [],
				items: ['通知', '公告', '评价'],
				current: 0,
			};
		},
		onTabItemTap() {
			this.userId = getApp().globalData.global_userId;
			this.getUserVillage();
		},
		onLoad: function(option) {
			this.userId = getApp().globalData.global_userId;
			this.getUserVillage();
		},
		methods: {
			
			/** 查询公告 **/
			getList() {
				this.$u.api.listNotice({
						village: this.village
					})
					.then(res => {
						this.newslist = res.rows;
					})
			},
			//获取用户小区信息
			getUserVillage() {
				this.$u.api.getUserVillage({
						userId: this.userId
					})
					.then(res => {
						this.VillageData = res.rows
						this.village = this.VillageData[0];
						this.index = 0;
						this.getList();
					})
			},
			navTo(url) {
				uni.navigateTo({
					url: url,
				});
			},
			//小区下拉框改变时调用
			change: function(e) {
				this.index = e.detail.value;
				this.village = this.VillageData[this.index];
				this.$u.api.listNotice({
						village: this.village
					})
					.then(res => {
						this.newslist = res.rows;
					})
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
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
		font-size: 40rpx;
		background: #FFF;
		flex: 1;
	}
</style>
