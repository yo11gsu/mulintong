<template>
	<view class="wrap">
		<scroll-view class="">
			<uni-card v-for="(address,i) in addresslist" :key="i" :title="address.community" :extra="address.village"
				shadow="0rpx 20rpx 20rpx 0rpx rgb(102, 180, 216)" :border="false" spacing="20rpx" padding="30rpx"
				margin="30rpx 20rpx" thumbnail="/static/aidex/images/home.png" @click="navTo('detail?id='+address.id)">
				<view class="uni-body" style="display: flex;font-size: 45rpx;">
					<view>
						{{address.building+" "}}{{address.unit+" "}}{{address.roomNumber}}
					</view>
					<view style="margin-left: auto;">
						<uni-tag v-if="address.moren==true" text="默认地址" type="primary">
						</uni-tag>
					</view>
				</view>
				<view slot="actions" style="display: flex;">
					<view style="display: flex;" class="tabButton">
						<u-button type="primary" size="mini" shape="square" @click="toggleGrid(address.village)">
							<view>网格长</view>
						</u-button>
						<u-button type="primary" size="mini" shape="square" style="margin-left: 20rpx;"
							@click="toggleProperty(address.village)">
							<view>物业</view>
						</u-button>
						<u-button type="primary" size="mini" shape="square" style="margin-left: 20rpx;"
							@click="toggleCommittee(address.village)">
							<view>委员会</view>
						</u-button>
						<u-button type="primary" size="mini" shape="square" style="margin-left: 20rpx;"
							@click="toggleAutonomous(address.village)">
							<view>自治小组</view>
						</u-button>
					</view>
					<view @click="navTo('community_modify?id='+address.id)"
						style="margin-left: auto;font-size: 30rpx;align-self: center;display: flex;">
						<uni-icons type="compose" size="15"></uni-icons>
						<view>修改地址</view>
					</view>
				</view>
			</uni-card>
		</scroll-view>
		<view class="btn-plus" @click="navTo('community_add?userId='+this.userId)">
			<u-icon name="plus-circle-fill" size="60" color="#3d87ff"></u-icon>
		</view>
		<view>
			<uni-popup ref="Grid_popup" type="center" :animation="true" maskBackgroundColor="#b1b1b1">
				<view class="popcontent" :style="{width: WindowWidth + 'px',height: WindowHeight + 'px'}">
					<uni-title class="popcontent_title" type="h4" align="center" title="网格长信息"></uni-title>
					<view class="popcontent_content">
						<view>姓名：{{Grid.name}}</view>
						<view style="margin-top: 20rpx;">电话号码：{{Grid.phone}}</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="Property_popup" type="center" :animation="true" maskBackgroundColor="#b1b1b1">
				<view class="popcontent" :style="{width: WindowWidth + 'px',height: WindowHeight + 'px'}">
					<uni-title class="popcontent_title" type="h4" align="center" title="物业信息"></uni-title>
					<view class="popcontent_content">
						<view>物业公司：{{Property.propetty}}</view>
						<view style="margin-top: 20rpx;">联系人：{{Property.duntactperson}}</view>
						<view style="margin-top: 20rpx;">电话号码：{{Property.phone}}</view>
						<view style="margin-top: 20rpx;">合同开始时间：{{Property.durationofcontract}}</view>
						<view style="margin-top: 20rpx;">合同结束时间：{{Property.durationofcontract_start}}</view>
						<view style="margin-top: 20rpx;">小区名称：{{Village}}</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="Committee_popup" type="center" :animation="true" maskBackgroundColor="#b1b1b1">
				<view class="popcontent" :style="{width: WindowWidth + 'px',height: WindowHeight + 'px'}">
					<uni-title class="popcontent_title" type="h4" align="center" title="委员会成员"></uni-title>
					<view class="popcontent_content_for">
						<view class="popcontent_content_for_item" style="margin-top: 20rpx;min-width: 30%;width: 180rpx;" v-for="Comm,index1 in Committee"
							:key="index1">{{Comm}}
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="Autonomous_popup" type="center" :animation="true" maskBackgroundColor="#b1b1b1">
				<view class="popcontent" :style="{width: WindowWidth + 'px',height: WindowHeight + 'px'}">
					<uni-title class="popcontent_title" type="h4" align="center" title="自治小组成员"></uni-title>
					<view class="popcontent_content_for">
						<view class="popcontent_content_for_item" style="margin-top: 20rpx;min-width: 30%;width: 180rpx;" v-for="Auto,index1 in Autonomous"
							:key="index1" :index="index1">{{Auto}}
						</view>
					</view>
				</view>
			</uni-popup>
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
				index1: 0,
				Grid: [],
				Property: [],
				Committee: [],
				Autonomous: [],
				Village: '',
				message: true,
				messageBar: true,
				upgrade: true,
				addresslist: [{
					userId: ''
				}],
				WindowWidth: '',
				WindowHeight: '',
			};
		},
		onShow: function() {
			this.addresslist.userId = getApp().globalData.global_userId;
			this.getlist();
			this.getSysInfo();
		},
		methods: {
			//获取系统信息
			getSysInfo() {
				let sysinfo = uni.getSystemInfoSync();
				this.WindowWidth = sysinfo.windowWidth;
				this.WindowHeight = sysinfo.windowHeight / 2;
			},
			toggleGrid(Village) {
				this.Village = Village;
				this.getGridInfo();
				this.$refs['Grid_popup'].open();
			},
			toggleProperty(Village) {
				this.Village = Village;
				this.getPropertyInfo();
				this.$refs['Property_popup'].open();
			},
			toggleCommittee(Village) {
				this.Village = Village;
				this.getCommitteeInfo();
				this.$refs['Committee_popup'].open();
			},
			toggleAutonomous(Village) {
				this.Village = Village;
				this.getAutonomousInfo();
				this.$refs['Autonomous_popup'].open();
			},
			//查询物业信息
			getPropertyInfo() {
				this.$u.api.PropertyInfo({
						name: this.Village
					})
					.then(res => {
						if (res.length != 0) {
							this.Property = res[0];
						}
					})
			},
			//查询网格长信息
			getGridInfo() {
				this.$u.api.GridInfo({
						name: this.Village
					})
					.then(res => {
						if (res.length != 0) {
							this.Grid = res[0];
						}
					})
			},
			//查询委员会成员
			getCommitteeInfo() {
				this.$u.api.CommitteeInfo({
						name: this.Village
					})
					.then(res => {
						if (res.length != 0) {
							this.Committee = res;
						} else {
							this.Committee = [
								"无"
							]
						}
					})
			},
			//查询自治小组
			getAutonomousInfo() {
				this.$u.api.AutonomousInfo({
						name: this.Village
					})
					.then(res => {
						if (res.length != 0) {
							this.Autonomous = res;
						} else {
							this.Autonomous = [
								"无"
							]
						}
					})
			},
			/* 查询社区信息 */
			getlist() {
				this.$u.api.addressInfo({
						userId: getApp().globalData.global_userId,
					})
					.then(res => {
						console.log(res);
						if (res.total == 0) {
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/sys/login/index'
								})
							}, 1500);
						}
						this.addresslist = res.rows;
					})
			},
			logout() {
				this.$u.api.logout().then(res => {
					this.$u.toast(res.msg);
					if (res.code == '200') {
						let self = this;
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/sys/login/index'
							});
						}, 500);
					}
				});
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},

		}
	};
</script>
<style lang="scss">
	/deep/ .u-cell-title {
		padding: 25rpx 30rpx;
		font-size: 30rpx;
	}

	.popcontent {
		background-color: #ffffff;
		padding: 15px;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		overflow: auto;
	}

	.popcontent_title {
		box-shadow: 10rpx 10rpx 20rpx 5rpx rgb(102, 180, 216);
		border-radius: 20rpx;
	}

	.popcontent_content {
		box-shadow: 10rpx 10rpx 20rpx 5rpx rgb(102, 180, 216);
		border-radius: 20rpx;
		margin-top: 50rpx;
		padding: 20rpx;
	}

	.popcontent_content_for {
		border-radius: 20rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-flow: wrap row;
	}
	.popcontent_content_for_item{
		box-shadow: 10rpx 10rpx 20rpx 5rpx rgb(102, 180, 216);
		border-radius: 20rpx;
		margin-top: 80rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: wrap row;
	}

	.btn-plus {
		position: fixed;
		bottom: 10px;
		right: 10rpx;
		z-index: 1;
		opacity: 0.6;
	}

	.tabButton {
		u-button {
			align-self: center;
			display: flex;
		}
	}

	.btn-plus:hover {
		opacity: 1;
	}
</style>
