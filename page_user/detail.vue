<template>
	<view class="content">
		<u-cell-group>
			<u-cell-item title="社区" :value="addressinfo.community" center="true" :arrow="false"></u-cell-item>
			<u-cell-item title="小区" :value="addressinfo.village" center="true" :arrow="false"></u-cell-item>
			<u-cell-item title="楼栋号" :value="addressinfo.building" center="true" :arrow="false"></u-cell-item>
			<u-cell-item title="单元号" :value="addressinfo.unit" center="true" :arrow="false"></u-cell-item>
			<u-cell-item title="房间号" :value="addressinfo.roomNumber" center="true" :arrow="false"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				addressinfo:[],
				id:'',
			}
		},
		onLoad:function(e){
			this.id=e.id;
			this.getlist();
		},
		methods:{
			/* 查询社区信息 */
			getlist() {
				this.$u.api.addressDetailInfo({
						id: this.id
					})
					.then(res => {
						console.log(res);
						this.addressinfo = res.data;
					})
			},
		},
	}
</script>

<style>
</style>
