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
			<uni-card v-for="(problem,index) in photoInfo" :title="problem.feedback_type" :extra="problem.create_time"
				:key="index" shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)"
				:border="false" :thumbnail="problem.thumbnail" spacing="10rpx" padding="20rpx" margin="30rpx 20rpx"
				@click="navTo('photoDetail?id='+problem.id)">
				<view class="uni-body" style="font-size: 35rpx;">
					<view class="u-body-item-title u-line-2">{{problem.feedback_content}}</view>
				</view>
				<view class="" slot="actions" style="display: flex;font-size: 30rpx;">
					<text style="color: #ff4339;" v-if="problem.status=='0'">未处理</text>
					<text style="color: #55aa00;" v-else>已处理</text>
					<text style="margin-left: auto;">{{village}}</text>
				</view>
			</uni-card>
		</view>
		<view style="margin-top: 40rpx;">
			<u-loadmore status="nomore" />
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				index: 0,
				userid: '',
				photoInfo: [],
				address: [],
				village: '',
				VillageData: [],
			}
		},
		onLoad() {
			this.userid = getApp().globalData.global_userId;
			this.getUserVillage();
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
						this.getphotoInfo();
					})
			},
			getphotoInfo() {
				this.$u.api.myphotoGet({
						userid: this.userid,
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
			//删除随手拍
			del(e) {
				console.log('id')
				uni.showModal({
					title:'提示',
					content:'请确认是否删除!',
					success:function(res){
						if(res.confirm){
							console.log(e);
							this.photoDel(e);
						}
					}.bind(this)
				})
			},
			photoDel(e){
				this.$u.api.photoDelete({
					id:e
				}).then(res =>{
					console.log(res);
					uni.startPullDownRefresh();
				})
			},
			onPullDownRefresh() {
				this.getphotoInfo();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 500);
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			change: function(e) {
				this.index = e.detail.value;
				this.village = this.VillageData[this.index];
				this.$u.api.myphotoGet({
						userid: this.userid,
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
