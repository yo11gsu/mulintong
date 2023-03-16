<template>
	<view>
		<view>
			<u-image src="https://mulintong.com/images/mulinjia.png" mode="widthFix" style="display: flex; margin: 0 auto;width: 50%;"></u-image>
		</view>
		<view class="wrapimg">
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/zhenggaiguangchang.png" mode="widthFix" @click="navTo('/page_photo/modifySquare')">
					</u-image>
				</view>
				<view class="text">整改广场</view>
			</view>
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/woyaopai.png" mode="widthFix" @click="navTo('/page_photo/takePhoto')"></u-image>
				</view>
				<view class="text">我要拍</view>
			</view>
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/woyipai.png" mode="widthFix" @click="navTo('/page_photo/havaTakePhoto')"></u-image>
				</view>
				<view class="text">我已拍</view>
			</view>
		</view>
		<!-- <view class="wrapimg">
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/ModifySquare.png" mode="widthFix" @click="navTo('/page_photo/modifySquare')">
					</u-image>
				</view>
				<text class="text">整改广场</text>
			</view>
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/TakePhoto.png" mode="widthFix" @click="navTo('/page_photo/takePhoto')"></u-image>
				</view>
				<text class="text">我要拍</text>
			</view>
			<view class="s1" :style="[{ width: fullwidth}]">
				<view class="img">
					<u-image src="https://mulintong.com/images/HaveTakePhoto.png" mode="widthFix" @click="navTo('/page_photo/havaTakePhoto')"></u-image>
				</view>
				<text class="text">我已拍</text>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fullHeight: '',
				fullwidth: '',
				scwidth:'',
			}
		},
		onLoad: function() {
			this.getFullData();
		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			getFullData() {
				var that = this
				uni.getSystemInfo({
					success: function(res) {
						//获取屏幕的高度
						that.fullHeight = res.windowHeight + 'px';
						//获取屏幕的宽度
						that.fullwidth = res.windowWidth/3 + 'px';
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.wrapimg {
		display: inline-flex;
		vertical-align: top;
		margin: 0 auto;
		margin-top: 300rpx;
	}

	.s1 {
		display: flex;
		flex-direction: column;
		text-align: center;
		height: 250rpx;
		justify-content: center;
		align-items: center;
	}

	.img {
		width: 150rpx;
		height: 150rpx;
	}

	.text {
		font-size: 50rpx;
	}
</style>
