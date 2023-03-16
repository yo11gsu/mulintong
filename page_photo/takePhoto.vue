<template>
	<view class="wrap">
		<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model="info">
			<u-form-item label="姓名" label-width="180">
				<text>{{userInfo.user_name}}</text>
			</u-form-item>
			<u-form-item label="联系方式" label-width="180">
				<text>{{userInfo.phonenumber}}</text>
			</u-form-item>
			<u-form-item label="地点" label-width="180" prop="location">
				<u-input placeholder="请输入地点" v-model="info.location" type="text" style="text-align: right;">
				</u-input>
			</u-form-item>
			<u-form-item label="问题" label-width="180" prop="problem">
				<u-input placeholder="请输入存在的问题" v-model="info.problem" type="textarea" style="text-align: right;">
				</u-input>
			</u-form-item>
			<u-form-item label="图片上传" prop="photo" label-width="180">
				<view style="margin-top: 20rpx;">
					<view class="img" v-for="(item, i) in imageValue" :key='i'>
						<image style="width: 100%;height: 100%;" :src="item" @click="ViewImage(i)"></image>
						<view @click="del(i)" style="display: inline;">
							<uni-icons type="icon-guanbi" custom-prefix="iconfont" class="close" size="20"></uni-icons>
						</view>
					</view>
					<view v-if="imageValue.length<9" class="camera" @click="upload()">
						<uni-icons type="image" size="50"></uni-icons>
					</view>
				</view>
			</u-form-item>
			<u-form-item label="报送项目" label-width="180">
				<picker :range="ProjectData" :value="index0" @change="Projectchange">
					<view class="uni-input">{{ProjectData[index0]}}</view>
				</picker>
			</u-form-item>
			<u-form-item label="社区" label-width="180">
				<picker @change="Communitychange" :value="index1" :range="Communitydata">
					<view class="uni-input">{{Communitydata[index1]}}</view>
				</picker>
			</u-form-item>
			<u-form-item label="小区" label-width="180">
				<picker @change="Villagechange" :value="index2" :range="VillageData">
					<view class="uni-input">{{VillageData[index2]}}</view>
				</picker>
			</u-form-item>
			<view>
				<u-button class="btn" type="primary" @click="submit()">提交</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	import getDateTime from '@/common/getdateTime.js';
	export default {
		data() {
			return {
				index: 0,
				imageValue: [

				],
				index0: 0,
				index1: 0,
				index2: 0,
				community: '',
				village: '',
				info: {
					location: '',
					problem: ''
				},
				rules: {
					'location': {
						type: 'string',
						required: true,
						message: '请输入地点',
						trigger: ['blur', 'change']
					},
					'problem': {
						type: 'string',
						required: true,
						message: '请输入存在的问题',
						trigger: ['blur', 'change']
					}
				},
				project: '',
				userId: '',
				userInfo: [],
				Communitydata: [],
				VillageData: [],
				ProjectData: ['电气类', '路政类', '垃圾类', '公共设施类', '其它类'],
			}
		},
		onLoad: function() {
			this.userId = getApp().globalData.global_userId;
			this.project = this.ProjectData[0]
			this.getuserinfo();
			this.getCommunity();
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
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
			ViewImage(i) {
				let imgurl = []
				this.imageValue.forEach(item => imgurl.push(item))
				uni.previewImage({
					urls: imgurl,
					current: this.imageValue[i]
				});
			},
			// 删除图片
			del(index) {
				this.imageValue.splice(index, 1);
				console.log(this.imageValue);
			},

			getuserinfo() {
				this.$u.api.getUserInfo({
						userId: this.userId
					})
					.then(res => {
						this.userInfo = res[0];
					})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						var timeStr = getDateTime.dateTimeStr('y-m-d h:i:s');
						this.$u.api.photoAdd({
								audio: '0',
								updateBy: this.userInfo.user_name,
								updateTime: timeStr,
								photos: this.imageValue,
								userid: this.userId,
								username: this.userInfo.user_name,
								createBy: this.userInfo.user_name,
								createTime: timeStr,
								location: this.info.location,
								feedbackType: this.project,
								feedbackContent: this.info.problem,
								feedbackCommunity: this.community,
								feedbackVillage: this.village,
								phone: this.userInfo.phonenumber,
								currentHandlerId: this.userId,
								status: '0'
							})
							.then(res => {
								console.log(res)
								if (res == 1) {
									uni.showToast({
										title: '提交成功!',
										icon: 'success'
									})
									this.$u.api.PropertyInfo({
											name: this.village
										})
										.then(res => {
											console.log(res[0].phone);
											this.$u.api.photosendCode({
												phone: res[0].phone
											})
										})
									setTimeout(function() {
										uni.navigateBack({
											delta: 1
										})
									}, 1500);
								} else {
									uni.showToast({
										title: '提交失败!',
										icon: 'error'
									})
								}
							})
					} else {
						console.log('验证失败');
					}
				});
			},
			//获取自己的社区
			getCommunity() {
				this.$u.api.photoCommunity({
						user_id: this.userId
					})
					.then(res => {
						this.Communitydata = res.rows;
						this.community = this.Communitydata[this.index1]
						this.getVillage(this.community)
					})
			},
			//获取全部社区
			getTotalCommunity() {
				this.$u.api.CommunityList({})
					.then(res => {
						this.Communitydata = res.rows;
						this.community = this.Communitydata[this.index1]
						this.getTotalVillage(this.community)
					})
			},
			//社区改变后获取对应小区
			Communitychange: function(e) {
				this.index1 = e.detail.value
				this.community = this.Communitydata[this.index1]
				this.getVillage(this.community);
			},
			//获取自己的小区
			getVillage(community) {
				this.$u.api.photoVillage({
						user_id: this.userId,
						community: community
					})
					.then(res => {
						this.VillageData = res.rows;
						this.village = this.VillageData[this.index2]
					})
			},
			getTotalVillage(community) {
				this.$u.api.VillageList({
						community: community,
					})
					.then(res => {
						this.VillageData = res.rows;
						this.village = this.VillageData[this.index2]
					})
			},
			Villagechange: function(e) {
				this.index2 = e.detail.value
				this.village = this.VillageData[this.index2]
			},
			Projectchange: function(e) {
				this.index0 = e.detail.value
				this.project = this.ProjectData[this.index0]
			},
			change(e) {
				console.log("e:", e);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.input-placeholder {
		text-align: right;
	}

	.u-input {
		text-align: right !important;
	}

	.u-form-item__message {
		text-align: right !important;
	}

	.uni-textarea-placeholder {
		text-align: left;
	}

	.u-form-item {
		font-size: 36rpx;
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
