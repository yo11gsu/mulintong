<template>
	<view class="list">
		<view style="margin-left: 30rpx;">
			<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model='address'>
				<u-form-item label="社区" label-width="180">
					<picker @change="Communitychange" :value="index1" :range="Communitydata">
						<view class="uni-input" v-if="first1==false" >{{Communitydata[index1]}}</view>
						<view class="uni-input" v-if="first1==true">{{address.community}} </view>
					</picker>
				</u-form-item>
				<u-form-item label="小区" label-width="180">
					<picker @change="Villagechange" :value="index2" :range="VillageData">
						<view class="uni-input" v-if="first2==false">{{VillageData[index2]}}</view>
						<view class="uni-input" v-if="first2==true">{{address.village}}</view>
					</picker>
				</u-form-item>
				<u-form-item label="楼栋号" label-width="180" prop='building'>
					<u-input @change="change()" placeholder="请输入楼栋号(必填)" v-model="address.building"></u-input>
				</u-form-item>
				<u-form-item label="单元号" label-width="180" prop='unit'>
					<u-input @change="change()" placeholder="请输入单元号(若无可不填)" v-model="address.unit"></u-input>
				</u-form-item>
				<u-form-item label="房间号" label-width="180" prop='roomNumber'>
					<u-input @change="change()" placeholder="请输入房间号(若无可不填)" v-model="address.roomNumber"></u-input>
				</u-form-item>
				<u-form-item label="默认地址" label-width="180">
					<u-switch v-model="moren" @change="morenchange()"></u-switch>
				</u-form-item>
			</u-form>
		</view>
		<view style="display: flex;margin-top: 250rpx;">
			<view class="button" @click="submit()"><text>提交</text></view>
			<view class="delbutton" @click="del()"><text>删除</text></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				MorenSwitch:'',
				first1: true,
				first2: true,
				index1: 0,
				index2: 0,
				Communitydata: [],
				VillageData: [],
				moren: false,
				message: true,
				messageBar: true,
				upgrade: true,
				address: {
					id: '',
					userId: '',
					community: '',
					village: '',
					building: '',
					unit: '',
					roomNumber: '',
					moren: false,
					createTime: '',
					createBy: '',
					updateBy: '',
					updateTime: ''
				},
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
			};
		},
		onLoad: function(option) {
			this.address.id = option.id;
			this.address.userId = getApp().globalData.global_userId;
			this.address.unit = '';
			this.address.roomNumber = '';
			this.getlist();
			this.getTotalCommunity();
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			/* 查询社区信息 */
			getlist() {
				this.$u.api.addressDetailInfo({
						id: this.address.id
					})
					.then(res => {
						console.log(res);
						this.address = res.data;
						if (res.data.moren == '1')
							this.moren = true;
						else this.moren = false;

					})
			},
			//获取全部社区
			async getTotalCommunity() {
				this.$u.api.CommunityList({})
					.then(res => {
						this.Communitydata = res.rows;
					})
					.then(res =>{
						this.getTotalVillage();
					})
					.then(res =>{
						for(var item in this.Communitydata){
							if(this.address.community==this.Communitydata[item]){
								this.index1=item;
								console.log(item);
								}
						}
					})
			},
			//社区改变后获取对应小区
			Communitychange: function(e) {
				this.index1 = e.detail.value
				this.address.community = this.Communitydata[this.index1]
				this.first1 = false;
				this.first2 = false;
				this.getTotalVillage();
			},
			getTotalVillage() {
				this.$u.api.VillageList({
						community: this.address.community,
					})
					.then(res => {
						this.VillageData = res.rows;
					})
					.then(res =>{
						for(var item in this.VillageData){
							if(this.address.village==this.VillageData[item]){
								this.index2=item;
								console.log(item);
							}
						}
					})
			},
			//小区改变后获取对应楼栋号
			Villagechange: function(e) {
				this.index2 = e.detail.value
				this.address.village = this.VillageData[this.index2]
				this.first2 = false;
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			async submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						if (this.address.moren == '1') {
							this.morenAddChange(this.address.moren)
						} else {
							this.addressModify();
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			del() {
				if (this.address.moren == '1') {
					uni.showToast({
						title: '无法删除默认地址!',
						icon: "none"
					})
				} else {
					this.$u.api.addressDelete({
							id: this.address.id
						})
						.then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: '删除成功!',
									icon: 'success'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1500);
							} else {
								uni.showToast({
									title: '删除失败!',
									icon: "error"
								})
							}
						})
				}
			},
			addressModify() {
				this.$u.api.addressModify({
						ID: this.address.id,
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
								title: '修改成功!',
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 1500);
						} else {
							uni.showToast({
								title: '修改失败!',
							})
						}
					})
			},
			//默认修改
			async morenAddChange(moren) {
				this.$u.api.addmorenModify({
						userId: this.address.userId,
						moren: moren,
					})
					.then(res => {
						this.addressModify();
					})
			},
			morenchange(e) {
				if (e == true)
					this.address.moren = '1';
				else
					this.address.moren = '0';
				this.moren = e;
			},
			change() {
				console.log("inputbuilding" + this.address.building);
				console.log("inputunit" + this.address.unit);
				console.log("inputroomNumber" + this.address.roomNumber);
			},
		}
	};
</script>

<style lang="scss">
	.button {
		color: #ffffff;
		font-size: 32rpx;
		width: 40%;
		height: 80rpx;
		background: #497bff;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(15, 168, 250, 0.4);
		border-radius: 10rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 50rpx auto 0;
	}

	.delbutton {
		color: #ffffff;
		font-size: 32rpx;
		width: 40%;
		height: 80rpx;
		background: #e11134;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(15, 168, 250, 0.4);
		border-radius: 10rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 50rpx auto 0;
	}
</style>
