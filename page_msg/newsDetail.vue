<template>
	<view>
		<view v-show="loding==true">
			<view class="title">
				<view class="title" style="margin: 20rpx;">
					<uni-title type="h4" align="center" :title="NewsNodes.noticeTitle"></uni-title>
				</view>
				<view>
					<u-line></u-line>
				</view>
				<view class="titleinfo">
					<view class="info">
						<view class="c1">发布者：{{NewsNodes.createBy}}</view>
						<view class="c1">时间：{{NewsNodes.createTime}}</view>
					</view>
					<view class="info">
						<view class="c1">社区：{{NewsNodes.community}}</view>
						<view class="c1">小区：{{NewsNodes.village}}</view>
						</text>
					</view>
				</view>
				<!-- <view style="padding: 20rpx;border-bottom: 1px solid #dedfe2;">
					<uni-title type="h5" title="内容:"></uni-title>
				</view> -->
				<view style="padding: 20rpx;border-bottom: 1px solid #dedfe2;"></view>
				<view class="maincontentwrap" style="line-height: 1.8;white-space: pre-wrap; "  >
					<mp-html :content="NewsNodes.noticeContent"  :selectable="true"  />
					<!-- <u-parse :html="NewsNodes.noticeContent" :show-with-animation="true" :selectable="true"
						:use-cache="true"></u-parse> -->
				</view>
			</view>
			<view v-if="NewsNodes.noticeType=='3'">
				<view class="" v-if="flag!='1'">
					<view class="uni-list">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in scores"
								:key="item.value">
								<view style="display: flex;flex-direction: row;align-items: center;margin-top: 20rpx;">
									<radio :value="item.value" :checked="index === current" />
									<view style="margin-left: 15rpx;">{{item.text}}</view>
									<view style="margin-left: 10rpx;" v-if="seen">
										{{item.per}}
									</view>
								</view>
							</label>
						</radio-group>
					</view>
					<view class="pinjiaBt">
						<u-button type="primary" size="medium" @click="submit" :disabled="check">提交</u-button>
					</view>
				</view>
				<view class="" v-else>
					<view class="uni-list">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in scores"
								:key="item.value">
								<view style="display: flex;flex-direction: row;align-items: center;margin-top: 20rpx;">
									<radio :value="item.value" :checked="index === current" disabled="true" />
									<view style="margin-left: 15rpx;">{{item.text}}</view>
									<view style="margin-left: 10rpx;">
										{{item.per}}
									</view>
								</view>
							</label>
						</radio-group>
					</view>
				</view>
			</view>
		</view>
		<view v-if="loding==false">
			<view style="display: flex;align-items: center;justify-content: center;flex-direction: row;">
				<u-loading mode="flower" size="1000rpx"></u-loading>
				<view style="display: flex;align-items: center;justify-content: center;flex-direction: row;">加载中...
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import getDateTime from '@/common/getdateTime.js';
	export default {

		data() {
			return {
				loding: false,
				userinfo: [],
				seen: false,
				check: true,
				score: 0,
				noticeId: '',
				NewsNodes: [],
				scores: [{
					text: '非常满意',
					value: 1,
					per: ''
				}, {
					text: '满意',
					value: 2,
					per: ''
				}, {
					text: '比较满意',
					value: 3,
					per: ''
				}, {
					text: '不满意',
					value: 4,
					per: ''
				}, {
					text: '非常不满意',
					value: 5,
					per: ''
				}, ],
				flag: '',
				iiii: true,
			}
		},
		onLoad: function(e) {
			this.noticeId = e.noticeId;
			this.getUserInfo();
			this.getNewsDetail();
			this.getFlag();
		},
		methods: {
			getUserInfo() {
				this.$u.api.getUserInfo({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						this.userinfo = res[0];
					});
			},
			getNewsDetail() {
				this.$u.api.noticeDetail({
						noticeId: this.noticeId
					})
					.then(res => {
						// this.NewsNodes = res.rows;
						this.NewsNodes = res.data;
						setTimeout(() => {
							this.loding = true;
						}, 100)
						// console.log(this.NewsNodes.noticeContent)
					})

			},
			async getPercent() {
				this.$u.api.evaluationPercent({
						noticeId: this.noticeId
					})
					.then(res => {
						this.scores = res;
					})
			},
			getFlag() {
				this.$u.api.whetherEvaluation({
						noticeId: this.noticeId,
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						if (res.length != 0) {
							this.flag = res[0].flag;
							if (this.flag == '1') {
								this.getPercent();
							}
						}
					})
			},
			async submit() {
				this.seen = true;
				var timeStr = getDateTime.dateTimeStr('y-m-d h:i:s');
				await this.$u.api.evaluationRecords({
					noticeId: this.noticeId,
					userId: getApp().globalData.global_userId,
					level: this.score,
					createBy: this.userinfo.user_name,
					createTime: timeStr,
					updateBy: this.userinfo.user_name,
					updateTime: timeStr
				});
				this.getPercent();
				this.getFlag();

			},
			radioChange: function(evt) {
				this.check = false;
				this.score = evt.detail.value;
			}
		},

	}
</script>

<style lang="scss">
	.uni-list-cell {
		justify-content: flex-start
	}

	.uni-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 100rpx;
	}

	.maincontentwrap {
		padding: 30rpx;
		margin: 20rpx 10rpx;
		border-radius: 20px;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
	}

	.titleinfo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-flow: wrap row;
		padding: 20rpx;
		margin: 10rpx 10rpx;
		border-radius: 20px;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
	}

	.pinjiaBt {
		margin-top: 50rpx;
		justify-content: center;
		display: flex;
		align-items: center;
	}

	.info {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: wrap row;
		margin-top: 10rpx;
	}

	.c1 {
		width: 300rpx;
	}
</style>
