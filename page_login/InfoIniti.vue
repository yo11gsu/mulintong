<template>
	<view>
		<view style="margin-left: 30rpx;">
			<u-form class="form" ref="uForm" label-position="left" :rules="rules" :model='userInfo'>
				<u-form-item label="姓名" label-width="180" prop='userName'>
					<u-input placeholder="请输入姓名" v-model="userInfo.userName"></u-input>
				</u-form-item>
				<u-form-item label="性别" label-width="180">
					<picker :range="option" :value="index" @change="sexPickerChange">
						<view>{{option[index]}}</view>
					</picker>
				</u-form-item>
				<u-form-item label="手机号" label-width="180" prop='phoneNumber'>
					<u-input placeholder="请输入手机号" v-model="userInfo.phoneNumber" type="number"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="button" @click="submit()" style="margin-top: 500rpx;"><text>提交</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: 0,
				option: ['男', '女'],
				userId: 0,
				userInfo: {
					userName: '',
					sex: '',
					phoneNumber: '',
					email: '',
				},
				rules: {
					'userName': {
						type: 'string',
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					},
					'phoneNumber': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
				},
			};
		},
		onLoad: function() {
			this.userId = getApp().globalData.global_userId;
			console.log("userId:" + this.userId);
			this.userInfo.sex = '男';
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			sexPickerChange: function(e) {
				this.index = e.detail.value;
				this.userInfo.sex = this.option[this.index];
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						if (this.userInfo.sex == '男') {
							this.userInfo.sex = '0';
						} else {
							this.userInfo.sex = '1';
						}
						this.$u.api.modifyUserInfo({
								userId: this.userId,
								userName: this.userInfo.userName,
								sex: this.userInfo.sex,
								phonenumber: this.userInfo.phoneNumber,
							})
							.then(res => {
								if (res == 1) {
									uni.showToast({
										title: '提交成功!',
										icon: "success"
									});
									setTimeout(function() {
										uni.navigateTo({
											url: '/page_login/AddressInit'
										})
									}, 1500);
								} else {
									uni.showToast({
										title: '提交失败!',
										icon: "error"
									})
								}
							})
					} else {
						console.log('验证失败');
					}
				});
			},
		}
	};
</script>

<style lang="scss" >
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
