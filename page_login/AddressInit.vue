<template>
	<view class="">
		<view style="margin-left: 30rpx;">
			<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model='address'>
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
				<u-form-item label="楼栋号" label-width="180" prop='building'>
					<u-input placeholder="请输入楼栋号(必填)" v-model="address.building"></u-input>
				</u-form-item>
				<u-form-item label="单元号" label-width="180" prop='unit'>
					<u-input placeholder="请输入单元号(若无可不填)" v-model="address.unit"></u-input>
				</u-form-item>
				<u-form-item label="房间号" label-width="180" prop='roomNumber'>
					<u-input placeholder="请输入房间号(若无可不填)" v-model="address.roomNumber"></u-input>
				</u-form-item>
				<u-form-item label="默认地址" label-width="180">
					<u-switch v-model="moren" @change="morenchange()" :disabled="true"></u-switch>
				</u-form-item>
			</u-form>
		</view>
		<view class="button" @click="submit()" style="margin-top: 300rpx;"><text>提交</text></view>
	</view>
</template>
<script>
	/**
	 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
	 */

	export default {
		data() {
			return {
				rules: {
					'building': {
						type: 'string',
						required: true,
						message: '请输入楼栋号',
						trigger: ['blur', 'change']
					},
					'unit': {
						type: 'string',
						required: false,
						message: '请输入单元号',
						trigger: ['blur', 'change']
					},
					'roomNumber': {
						type: 'string',
						required: false,
						message: '请输入房间号',
						trigger: ['blur', 'change']
					},
				},
				index1: 0,
				index2: 0,
				Communitydata: [],
				VillageData: [],
				moren: true,
				address: {
					id: '',
					userId: '',
					community: null,
					village: null,
					building: null,
					unit: null,
					roomNumber: null,
					moren: false,
					createTime: '',
					createBy: '',
					updateBy: '',
					updateTime: ''
				},
			};
		},
		onLoad: function() {
			this.address.moren = '1';
			this.address.userId = getApp().globalData.global_userId;
			this.address.roomNumber = '';
			this.address.unit = '';
			this.getTotalCommunity();
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						this.addAddress();
					} else {
						console.log('验证失败');
					}
				});
			},
			//默认修改
			morenAddChange(moren) {
				this.$u.api.addmorenModify({
						userId: this.address.userId,
						moren: moren,
					})
					.then(res => {
						console.log(res);
					})
			},
			addAddress() {
				this.$u.api.addressAdd({
						userId: this.address.userId,
						community: this.address.community,
						village: this.address.village,
						building: this.address.building,
						unit: this.address.unit,
						roomNumber: this.address.roomNumber,
						moren: this.address.moren,
					})
					.then(res => {
						if (res == 1) {
							uni.showToast({
								title: '提交成功!',
								icon: 'success'
							})
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/sys/login/index'
								})
							}, 1500);
						} else {
							uni.showToast({
								title: '提交失败!',
								icon: "error"
							})
						}

					})
			},
			//获取全部社区
			getTotalCommunity() {
				this.$u.api.CommunityList({})
					.then(res => {
						this.Communitydata = res.rows;
						this.address.community = res.rows[0];
						this.getTotalVillage(this.address.community);
					})
			},
			//社区改变后获取对应小区
			Communitychange: function(e) {
				this.index1 = e.detail.value
				this.address.community = this.Communitydata[this.index1]
				this.getTotalVillage(this.address.community);
			},
			getTotalVillage(community) {
				this.$u.api.VillageList({
						community: community,
					})
					.then(res => {
						this.VillageData = res.rows;
						this.address.village = this.VillageData[this.index2]
					})
			},
			//小区改变
			Villagechange: function(e) {
				this.index2 = e.detail.value
				this.address.village = this.VillageData[this.index2]
			},
			morenchange(e) {
				if (e == true)
					this.address.moren = '1';
				else
					this.address.moren = '0';
				this.moren = e;
			},
		}
	};
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
</style>
