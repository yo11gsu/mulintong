<template>
	<view class="wrap">
		<view class="">
			<view class="title" style="border-bottom: 1px solid #dedfe2;">
				<uni-title type="h4" align="center" :title="Chatlist.roomTitle"></uni-title>
			</view>
			<uni-list>
				<uni-list-item title="开始时间" thumb="https://mulintong.com/images/starttime.png"
					:note="Chatlist.startTime">
				</uni-list-item>
				<uni-list-item title="议事内容" thumb="https://mulintong.com/images/meetingcontent.png"
					:note="Chatlist.content">
				</uni-list-item>
				<uni-list-item title="社区" thumb="https://mulintong.com/images/community.png" :note="Chatlist.community">
				</uni-list-item>
				<uni-list-item title="小区" thumb="https://mulintong.com/images/village.png" :note="Chatlist.village">
				</uni-list-item>
				<uni-list-item title="负责人" thumb="https://mulintong.com/images/principal.png" :note="Chatlist.name">
				</uni-list-item>
				<uni-list-item title="联系电话" thumb="https://mulintong.com/images/phone.png" :note="Chatlist.phonenumber">
				</uni-list-item>
			</uni-list>
			<view style="margin-top: 30rpx;">
				<view class="u-countdown" v-if="timestamp>=0">
					<view style="font-size: 30rpx;">距离议事开始还有</view>
					<u-count-down :timestamp="timestamp" separator="zh" font-size="20rpx" ></u-count-down>
				</view>
				<view class="u-countdown" style="font-size: 30rpx;"v-if="startflag>=0">议事已经开始啦赶快加入吧！</view>
				<view class="info" style="border-bottom: 1px solid #dedfe2;">
					<uni-icons type="person" size="20"></uni-icons>
					<text style="margin-left: 15rpx;">用户信息：</text>
					<text style="">{{userInfo.userName+" "}}{{userInfo.village+" "}}{{userInfo.phonenumber}}
					</text>
				</view>
				<view class="button" @click="inputDialogToggle()"><text>进入议事</text></view>
				<!-- 输入框 -->
				<uni-popup ref="inputDialog" type="dialog">
					<uni-popup-dialog title="房间密码" @confirm="onSelectRoom">
						<uni-easyinput type="number" v-model="this.pswd" placeholder="请输入密码"></uni-easyinput>
					</uni-popup-dialog>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import restApi from '../lib/restapi';
	import base64 from '@/common/base64.js';
	import getDateTime from '@/common/getdateTime.js';
	export default {
		data() {
			return {
				timestamp: '',
				startflag: '',
				pswd: '',
				index: 0,
				village: '',
				userId: 1,
				roomId: 11,
				userInfo: [],
				Chatlist: [{
					roomTitle: "",
					startTime: '',
					content: '',
					name: '',
					village: '',
					phonenumber: '',
					roomId: 11,
				}],
				selectedAvatar: {
					imgUrl: '',
					id: ''
				},
				VillageData: [],
				imgUrl: '',
				currentUser: null,
			};
		},
		onLoad: function(option) {
			this.Chatlist.roomId = option.roomId;
			this.userId = getApp().globalData.global_userId;
			this.getChatInfo();
		},
		onShow: function() {
			let currentUser = uni.getStorageSync('currentUser');
			this.currentUser = currentUser;
			if (this.goEasy.getConnectionStatus() === 'disconnected') {
				this.connectGoEasy(); //连接goeasy
				this.subscribeGroup(); //建立连接后，就应该订阅群聊消息，避免漏掉
			}
		},
		methods: {
			getChatInfo() {
				this.$u.api.chatInfoDetail({
						roomId: this.Chatlist.roomId
					})
					.then(res => {
						this.Chatlist = res[0];
						this.village = res[0].village
						var timeNow = getDateTime.dateTimeStr('y/m/d h:i:s');
						const oldtime = new Date(this.Chatlist.startTime)
						const newtime = new Date(timeNow)
						this.startflag = (newtime.getTime() - oldtime.getTime()) / 1000;
						this.timestamp = (oldtime.getTime() - newtime.getTime()) / 1000;
					})
					.then(res =>{
						this.getUserInfo();
					})
			},
			getUserInfo() {
				this.$u.api.chatUserInfo({
						userId: this.userId,
						village: this.village
					})
					.then(res => {
						this.userInfo = res[0];
					})
			},
			del() {
				this.$u.api.chatDel({
						roomId: this.Chatlist.roomId
					})
					.then(res => {
						if (res.code == 200)
							uni.showToast({
								title: '删除成功!',
								icon: 'success'
							})
						else {
							uni.showToast({
								title: '删除失败!',
								icon: 'error'
							})
						}
					})
			},
			inputDialogToggle() {
				console.log(typeof(getApp().globalData.global_userId + '' + this.Chatlist.roomId));
				if (this.startflag >= 0) {
					if (uni.getStorageSync((this.Chatlist.roomId).toString()) != (getApp().globalData.global_userId + '' +
							this.Chatlist.roomId)) {
						this.$refs.inputDialog.open()
					} else {
						uni.navigateTo({
							url: '/page_chat/groupChat?to=' + this.Chatlist.roomId
						})
					}
				} else {
					uni.showToast({
						title: '未到议事时间!',
						icon: 'error',
						duration: 2000
					})
				}
			},
			onSelectRoom() { //登录
				// this.pswd = e;
				if (this.pswd == this.Chatlist.password) {
					uni.navigateTo({
						url: '/page_chat/groupChat?to=' + this.Chatlist.roomId
					})
					uni.setStorageSync((this.Chatlist.roomId).toString(), getApp().globalData.global_userId + '' + this
						.Chatlist.roomId)
				} else {
					uni.showToast({
						title: '密码错误!',
						icon: 'error'
					})
				}
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			//聊天室

			connectGoEasy() {
				uni.showLoading();
				this.goEasy.connect({
					// id: this.userId,
					id: this.currentUser.uuid,
					data: {
						name: this.currentUser.name,
						avatar: this.currentUser.avatar,
						village: this.currentUser.village
					},
					onSuccess: () => {
						console.log('GoEasy connect successfully.')
					},
					onFailed: (error) => {
						console.log('Failed to connect GoEasy, code:' + error.code + ',error:' + error
							.content);
					},
					onProgress: (attempts) => {
						console.log('GoEasy is connecting', attempts);
					}
				});
			},
			// 加载最新的会话列表
			loadConversations() {
				this.goEasy.im.latestConversations({
					onSuccess: (result) => {
						let content = result.content;
						this.renderConversations(content);
						uni.hideLoading();
					},
					onFailed: (error) => {
						uni.hideLoading();
						console.log('获取最新会话列表失败, error:', error);
					}
				});
			},
			subscribeGroup() {
				var groupIds = [];
				groupIds.push(this.Chatlist.roomId)
				this.goEasy.im.subscribeGroup({
					groupIds: groupIds,
					onSuccess: function() {
						console.log('订阅群消息成功');
					},
					onFailed: function(error) {
						console.log('订阅群消息失败:', error);
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.button {
		color: #ffffff;
		font-size: 32rpx;
		width: 80%;
		height: 80rpx;
		background: #497bff;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(15, 168, 250, 0.4);
		border-radius: 10rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 50rpx auto 0;
	}

	.u-countdown {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dialog-text {
		font-size: 14px;
		color: #333;
	}

	.info {
		margin-top: 50rpx!important;
		align-self: center;
		display: flex;
		font-size: 35rpx;
		margin: 15rpx;
	}
</style>
