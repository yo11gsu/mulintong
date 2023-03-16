<template>
	<view class="wrap form_right">
		<u-form class="form" ref="uForm" label-position="left">
			<u-form-item label="议事标题" label-width="150">
				<u-input placeholder="请输入议事标题(15字以内)" v-model="title" maxlength="15"></u-input>
			</u-form-item>
			<u-form-item label="议事时间" label-width="150">
				<uni-datetime-picker type="datetime" v-model="datetimesingle" @change="changeLog" :border="false"/>
			</u-form-item>
			<u-form-item label="社区" label-width="150">
				<picker @change="Communitychange" :value="index1" :range="Communitydata">
					<view class="uni-input">{{Communitydata[index1]}}</view>
				</picker>
			</u-form-item>
			<u-form-item label="小区" label-width="150">
				<picker @change="Villagechange" :value="index2" :range="VillageData">
					<view class="uni-input">{{VillageData[index2]}}</view>
				</picker>
			</u-form-item>
			<u-form-item label="议事内容" label-width="150">
				<view>
					<textarea placeholder="请输入议事内容" v-model="content" confirm-type="0/140"></textarea>
				</view>
			</u-form-item>
			<u-form-item label="发起者" label-width="150">
				<u-input v-model="name"></u-input>
			</u-form-item>
			<u-form-item label="联系方式" label-width="150">
				<u-input placeholder="请输入联系方式" v-model="phonenumber"></u-input>
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
				title:'',
				content:'',
				name:'',
				roomId:1,
				phonenumber:'',
				index1: 0,
				index2: 0,
				Communitydata: [],
				VillageData: [],
				address: [{
					community: '',
					village: '',
					roomId:1,
				}],
				datetimesingle: '',
				start: Date.now() - 1000000000,
				end: Date.now() + 1000000000
			};
		},
		onLoad: function(option) {
			this.address.roomId=option.roomId;
			console.log("roomId:"+option.roomId);
			this.getTotalCommunity();
			this.getTotalVillage();
			this.getChatInfo();
			this.name = '张三';
		},
		mounted() {
			setTimeout(() => {
				this.datetimesingle = Date.now()
			}, 3000)
		},
		methods: {
			getChatInfo(){
				this.$u.api.chatInfoDetail({
					roomId:this.address.roomId,
				})
				.then(res =>{
					this.name=res.name;
					this.content=res.content;
					this.phonenumber=res.phonenumber;
					this.datetimesingle=res.startTime;
					this.address.community=res.community;
					this.address.village=res.village;
					this.title=res.roomTitle;
				})
			},
			//获取全部社区
			getTotalCommunity() {
				this.$u.api.CommunityList({})
					.then(res => {
						this.Communitydata = res.rows;
						this.address.community = res.rows[0];
					})
			},
			//社区改变后获取对应小区
			Communitychange: function(e) {
				this.index1 = e.detail.value
				this.address.community = this.Communitydata[this.index1]
				this.getTotalVillage();
			},
			getTotalVillage() {
				this.$u.api.VillageList({
						community: this.address.community,
					})
					.then(res => {
						this.VillageData = res.rows;
						this.address.village=res.rows[0];
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
			changeLog(e){
				console.log('change事件:',e);
			},
			submit(){
				this.$u.api.chatAdd({
					roomTitle: this.title,
					content: this.content,
					startTime: this.datetimesingle,
					community: this.address.community,
					village: this.address.village,
					name: this.name,
					phonenumber: this.phonenumber
				})
				.then(res =>{
					console.log(res);
				})
			},
		}
	};
</script>
<style lang="scss" scoped>

</style>
