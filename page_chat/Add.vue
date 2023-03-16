<template>
	<view >
		<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model='address'>
			<u-form-item label="议事标题" label-width="180" prop="title">
				<u-input placeholder="请输入议事标题(15字以内)" v-model="address.title" maxlength="15"></u-input>
			</u-form-item>
			<u-form-item label="议事时间" label-width="180">
				<uni-datetime-picker type="datetime" v-model="datetimesingle" @change="changeLog" :border="false" />
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
			<u-form-item label="议事内容" label-width="180" prop="content">
				<view>
					<textarea placeholder="请输入议事内容" v-model="address.content"></textarea>
				</view>
			</u-form-item>
			<u-form-item label="发起者" label-width="180">
				<u-input v-model="userInfo.user_name" disabled="true"></u-input>
			</u-form-item>
			<u-form-item label="联系方式" label-width="180">
				<u-input placeholder="请输入联系方式" v-model="userInfo.phonenumber" disabled="true"></u-input>
			</u-form-item>
		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit()">提交</u-button>
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
				userId: '',
				index1: 0,
				index2: 0,
				Communitydata: [],
				VillageData: [],
				address: {
					community: null,
					village: null,
					title: null,
					content: null,
				},
				datetimesingle: '',
				start: Date.now() - 1000000000,
				end: Date.now() + 1000000000,
				userInfo: [],
				rules: {
					'title': {
						type: 'string',
						required: true,
						message: '请输入议事标题',
						trigger: ['blur', 'change']
					},
					'content': {
						type: 'string',
						required: true,
						message: '请输入议事内容',
						trigger: ['blur', 'change']
					},
				},
			};
		},
		onLoad: function() {
			this.userId = getApp().globalData.global_userId;
			this.getUserInfo();
			this.getCommunity();
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		mounted() {
			setTimeout(() => {
				this.datetimesingle = Date.now()
			}, 0)
		},
		methods: {
			//获取用户信息
			getUserInfo() {
				this.$u.api.getUserInfo({
						userId: this.userId
					})
					.then(res => {
						this.userInfo = res[0];
					})
			},
			//获取社区
			getCommunity() {
				this.$u.api.photoCommunity({
						user_id: this.userId
					})
					.then(res => {
						this.Communitydata = res;
						this.address.community = this.Communitydata[this.index1]
						this.community = this.Communitydata[this.index1]
						this.getVillage(this.community)
					})
			},
			//社区改变后获取对应小区
			Communitychange: function(e) {
				this.index1 = e.detail.value
				this.address.community = this.Communitydata[this.index1]
				this.getVillage(this.address.community);
			},
			//获取自己的小区
			getVillage(community) {
				this.$u.api.photoVillage({
						userid: this.userId,
						community: community
					})
					.then(res => {
						this.VillageData = res;
						this.address.village = this.VillageData[this.index2]
						this.village = this.VillageData[this.index2]
					})
			},
			Villagechange: function(e) {
				this.index2 = e.detail.value
				this.address.village = this.VillageData[this.index2]
			},
			change(e) {
				this.single = e
				console.log('change事件:', this.single = e);
			},
			changeLog(e) {
				console.log('change事件:', e);
			},

			submit() {
				console.log(this.address)
				this.$refs.uForm.validate(valid => {
					if(valid){
						console.log('数据验证成功')
						this.$u.api.chatAdd({
								roomTitle: this.address.title,
								content: this.address.content,
								startTime: this.datetimesingle,
								community: this.address.community,
								village: this.address.village,
								name: this.userInfo.user_name,
								phonenumber: this.userInfo.phonenumber
							})
							.then(res => {
								console.log(res);
							})
					}
					else{
						console.log('数据验证失败')
					}
				})
			},
		}
	};
</script>
<style lang="scss" scoped>

</style>
