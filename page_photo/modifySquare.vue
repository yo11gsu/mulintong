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
			<uni-card v-for="(problem,i) in photoInfo" :key="i" :title="problem.feedback_type"
				:extra="problem.create_time" shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)"
				:thumbnail="problem.thumbnail" :border="false" spacing="10rpx" padding="20rpx" margin="30rpx 20rpx">
				<view class="uni-body" style="font-size: 35rpx;">
					<view class="u-body-item-title u-line-2">{{problem.feedback_content}}</view>
				</view>
				<view class="" slot="actions" style="display: flex;font-size: 30rpx;">
					<view @click="navTo('photoDetail?id='+problem.id)" style="color: #81848a;">查看详情>></view>
					<text style="color: #ff4339;margin-left: auto;" v-if="problem.status=='0'">未处理</text>
					<text style="color: #55aa00;margin-left: auto;" v-else>已处理</text>
				</view>
			</uni-card>
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
				index: 0,
				village: '',
				VillageData: [],
				photoInfo: [{
					userid: '',
				}]
			}
		},
		onLoad: function() {
			this.getUserVillage();
		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			getUserVillage() {
				this.$u.api.getUserVillage({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						this.VillageData = res.rows;
						this.village = this.VillageData[0];
						this.index = 0;
						this.getPhotos();
					})
			},
			getPhotos() {
				this.$u.api.photoGet({
						feedbackVillage: this.village,
					})
					.then(res => {
						this.photoInfo = res.rows;
						for (let item in this.photoInfo) {
							if (this.photoInfo[item].feedback_type == '垃圾类')
								this.photoInfo[item].thumbnail = 'https://mulintong.com/images/PhotoIndex/laji.png';
							else if (this.photoInfo[item].feedback_type == '电气类') {
								this.photoInfo[item].thumbnail = 'https://mulintong.com/images/PhotoIndex/dianqi.png';
							} else if (this.photoInfo[item].feedback_type == '路政类') {
								this.photoInfo[item].thumbnail = 'https://mulintong.com/images/PhotoIndex/luzheng.png';
							} else if (this.photoInfo[item].feedback_type == '公共设施类') {
								this.photoInfo[item].thumbnail =
									'https://mulintong.com/images/PhotoIndex/gonggongsheshi.png';
							} else if (this.photoInfo[item].feedback_type == '其它类') {
								this.photoInfo[item].thumbnail = 'https://mulintong.com/images/PhotoIndex/qita.png';
							}
						}
					})
			},
			change: function(e) {
				this.index = e.detail.value;
				this.village = this.VillageData[this.index];
				this.$u.api.photoGet({
						feedbackVillage: this.village
					})
					.then(res => {
						this.photoInfo = res.rows;
						for (let item in this.photoInfo) {
							if (this.photoInfo[item].feedback_type == '垃圾类')
								this.photoInfo[item].thumbnail =
								'https://mulintong.com/images/PhotoIndex/laji.png';
							else if (this.photoInfo[item].feedback_type == '电气类') {
								this.photoInfo[item].thumbnail =
									'https://mulintong.com/images/PhotoIndex/dianqi.png';
							} else if (this.photoInfo[item].feedback_type == '路政类') {
								this.photoInfo[item].thumbnail =
									'https://mulintong.com/images/PhotoIndex/luzheng.png';
							} else if (this.photoInfo[item].feedback_type == '公共设施类') {
								this.photoInfo[item].thumbnail =
									'https://mulintong.com/images/PhotoIndex/gonggongsheshi.png';
							} else if (this.photoInfo[item].feedback_type == '其它类') {
								this.photoInfo[item].thumbnail =
									'https://mulintong.com/images/PhotoIndex/qita.png';
							}
						}
					})

			},
		}
	};
</script>
<style lang="scss">
	.VillagePicker {
		height: 50rpx;
		padding: 15rpx 25rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		background: #FFF;
		flex: 1;
	}
</style>
