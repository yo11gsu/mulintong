<template>
	<view style="">
		<view class="title" style="border-bottom: 1px solid #dedfe2;">
			<uni-title type="h4" align="center" :title="info.feedbackCommunity+'  '+info.feedbackVillage"></uni-title>
		</view>
		<view style="display: flex; flex-direction: row;justify-content: center;margin-top: 10rpx;">
			<view class="titleinfo">
				<view class="info">
					<view class="c1" :style="{width: WindowWidth/3 + 'px'}">申报人：{{info.username}}</view>
					<view class="c2">联系方式：{{info.phone}}</view>
				</view>
				<view class="info">
					<view class="c1" :style="{width: WindowWidth/3 + 'px'}">项目类型：{{info.feedbackType}}</view>
					<view class="c2" v-if="info.status=='1'">处理情况：已处理</view>
					<view class="c2" v-else>处理情况：未处理</view>
				</view>
				<view class="info">
					<view class="c1" :style="{width: WindowWidth/3 + 'px'}">时间：{{info.createTime}}</view>
					<view class="c2" :style="{width: WindowWidth/2.4 + 'px'}">位置：{{info.location}}</view>
				</view>
			</view>
		</view>
		<view style="margin: 40rpx 40rpx;">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button"
				activeColor="#007aff"></uni-segmented-control>
		</view>
		<view class="ContentWrap">
			<view class='problem' v-show="current === 0">
				<view class="content">
					<view style="display: flex;flex-direction: row;">
						<uni-title type="h5" title="问题描述:"></uni-title>
						<view style="margin-left: auto;">
							<u-button type="primary" @click="inputDialogToggle"
								v-if="usertype=='01'&&ctrlVillage==info.feedbackVillage">点击整改</u-button>
						</view>
					</view>
					<view class="feedbackcontent">{{info.feedbackContent}}</view>
				</view>
				<view class="picture">
					<view style="padding: 20rpx;">
						<uni-title type="h5" title="照片:"></uni-title>
					</view>
					<view class="" v-for="(x,index) in photos" :key="index" style="">
						<view>
							<image @click="ViewPhoto(index)" :src='x' mode="widthFix" 
								style="width: 100%;">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="aftermodify" v-if="info.status=='1'">
					<view class="content">
						<view style="display: flex;flex-direction: row;">
							<uni-title type="h5" title="整改说明:"></uni-title>
							<view style="margin-left: auto;">
								<u-button type="primary" @click="inputDialogToggle"
									v-if="usertype=='01'&&ctrlVillage==info.feedbackVillage">点击整改
								</u-button>
							</view>
						</view>
						<view class="feedbackcontent">{{info.modifyContent}}</view>
					</view>
					<view class="picture">
						<view style="padding: 20rpx;">
							<uni-title type="h5" title="整改后照片:"></uni-title>
						</view>
						<view class="" v-for="(x,index) in afterphotos" :key="index">
							<view>
								<image @click="ViewAfterPhoto(index)" :src='x' mode="widthFix"
									style="width: 100%;">
								</image>
							</view>
						</view>
					</view>
				</view>
				<view v-else style="margin-top: 200rpx;">
					<uni-title align="center" type="h3" title="暂无整改信息"></uni-title>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog title="整改信息填写" @confirm="imgDialogToggle">
					<uni-easyinput type="textarea" autoHeight v-model="modifycontent" placeholder="请输入整改说明">
					</uni-easyinput>
				</uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="imgDialog" type="dialog">
				<uni-popup-dialog title="整改照片上传" @confirm="submit" @close="inputDialogToggle" cancelText="返回">
					<view style="margin-top: 20rpx;">
						<view class="img" v-for="(item, i) in imageValue" :key='i'>
							<image style="width: 100%;height: 100%;" :src="item" @click="ViewImage(i)"></image>
							<view @click="del(i)" style="display: inline;">
								<uni-icons type="icon-guanbi" custom-prefix="iconfont" class="close" size="20">
								</uni-icons>
							</view>
						</view>
						<view v-if="imageValue.length<9" class="camera" @click="upload()">
							<uni-icons type="image" size="40"></uni-icons>
						</view>
					</view>
				</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import getDateTime from '@/common/getdateTime.js';
	export default {
		data() {
			return {
				imageValue: [

				],
				index: 0,
				photos: [],
				afterphotos: [],
				usertype: '',
				modifycontent: '',
				info: [],
				id: '',
				items: ['整改前', '整改后'],
				current: 0,
				userinfo: [],
				ctrlVillage: '',
				ctrlCommunity: '',
				WindowWidth: '',
			}
		},
		onLoad: function(e) {
			this.usertype = getApp().globalData.global_usertype;
			this.ctrlVillage = getApp().globalData.global_ctrlVillage;
			this.ctrlCommunity = getApp().globalData.global_ctrlCommunity;
			this.id = e.id;
			this.getSysInfo();
			this.getUserInfo();
			this.getphotoInfo();
		},
		methods: {
			//获取系统信息
			getSysInfo() {
				let sysinfo = uni.getSystemInfoSync();
				this.WindowWidth = sysinfo.windowWidth;
				this.WindowHeight = sysinfo.windowHeight / 2;
			},
			getUserInfo() {
				this.$u.api.getUserInfo({
						userId: getApp().globalData.global_userId
					})
					.then(res => {
						this.userinfo = res[0];
					});
			},
			upload() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						if (this.imageValue.length + chooseImageRes.tempFilePaths.length <= 9) {
							for (var i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
								const tempFilePaths = chooseImageRes.tempFilePaths[i];
								uni.uploadFile({
									url: this.vuex_config.baseUrl + '/common/multiPicturesUpload',
									filePath: tempFilePaths,
									name: 'file',
									success: (uploadFileRes) => {
										this.imageValue.push(this.vuex_config.baseUrl + JSON
											.parse(
												JSON
												.parse(JSON.stringify(uploadFileRes.data)))
											.imgUrl)
									}
								});
							}
						} else {
							uni.showModal({
								title: '添加失败',
								content: '最多上传9张图片!',
							})
						}
					}
				});
			},
			//图片预览
			ViewImage(i) {
				let imgurl = []
				this.imageValue.forEach(item => imgurl.push(item))
				uni.previewImage({
					urls: imgurl,
					current: this.imageValue[i]
				});
			},
			ViewPhoto(i) {
				let imgurl = []
				this.photos.forEach(item => imgurl.push(item))
				if (this.photos[0] != "") {
					uni.previewImage({
						urls: imgurl,
						current: this.photos[i]
					});
				}
			},
			ViewAfterPhoto(i) {
				let imgurl = []
				this.afterphotos.forEach(item => imgurl.push(item))
				if (this.afterphotos[0] != "") {
					uni.previewImage({
						urls: imgurl,
						current: this.afterphotos[i]
					});
				}
			},
			// 删除图片
			del(index) {
				this.imageValue.splice(index, 1);
			},
			inputDialogToggle() {
				this.$refs.inputDialog.open()
			},
			imgDialogToggle() {
				this.$refs.imgDialog.open()
			},
			getphotoInfo() {
				this.$u.api.photoDetailInfo({
						id: this.id
					})
					.then(res => {
						console.log(res);
						this.info = res.data;
						if (this.info.photos != null) {
							this.photos = (this.info.photos).split(',');
						}
						if (this.info.modifyPhotos != null) {
							this.afterphotos = (this.info.modifyPhotos).split(',');
						}
					})
			},
			submit() {
				var timeStr = getDateTime.dateTimeStr('y-m-d h:i:s'); // y:年 m:月 d:日 h:时 i:分 s:秒 中间的分割符号可更改
				this.$u.api.photoFeedback({
						id: this.id,
						modifyBy: this.userinfo.user_name,
						modifyTime: timeStr,
						modifyContent: this.modifycontent,
						modifyPhotos: this.imageValue
					})
					.then(res => {
						console.log(res)
					})
				uni.startPullDownRefresh();
			},
			onPullDownRefresh() {
				console.log('refresh');
				this.getphotoInfo();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
		}
	}
</script>

<style lang="scss">
	.titleinfo {
		position: relative;
		display: inline-block;
		vertical-align: top;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
		border-radius: 20rpx;
		padding: 25rpx;
	}

	.content {
		border-radius: 20rpx;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
		padding: 40rpx;
		margin: 20rpx;
	}

	.picture {
		border-radius: 20rpx;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgb(102, 180, 216);
		padding: 40rpx;
		margin: 20rpx;
	}

	.info {
		display: flex;
		margin-bottom: 10rpx;
	}

	.ContentWrap {
		margin: 10rpx 25rpx;
	}

	.feedbackcontent {
		font-size: 35rpx;
		line-height: 60rpx;
	}

	.c1 {}

	.c2 {
		margin-left: 50rpx;
	}

	.img {
		position: relative;
		display: inline-block;
		width: 150rpx;
		height: 150rpx;
		vertical-align: top;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}

	.close {
		position: absolute;
		right: 0;
		background-color: rgba(0, 0, 0, .4);
		color: #fff;
	}

	.camera {
		display: inline-block;
		width: 150rpx;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
		font-size: 46rpx;
		border: 1rpx dotted #8C9697;
		color: #8C9697;
		margin-bottom: 10rpx;
	}
</style>
