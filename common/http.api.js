/**
 * Copyright (c) 2013-Now http://aidex.vip All rights reserved.
 */
// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作
const install = (Vue, vm) => {
	
	// 参数配置对象
	const config = vm.vuex_config;
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		//微信登录
		wxLogin:(params={})=> vm.$u.get(config.adminPath+'/wx/user/wxff3ba19a26d2069f/login',params),
		// wxLogin:(params={})=> vm.$u.get('/wx/user/${params.appid}/login',params),
		//授权
		postauth:(params={})=> vm.$u.get(config.adminPath+'/wx/user/wxff3ba19a26d2069f/postAuth',params),
		auth:(params={})=> vm.$u.get(config.adminPath+'/wx/user/wxff3ba19a26d2069f/getSysUserInfoByOpenid/'+params.openid),
		//个人信息
		getUserInfo: (params = {}) => vm.$u.get(config.adminPath+'/wx/user/wxff3ba19a26d2069f/getUserInfo', params),
		//用户个人信息修改
		modifyUserInfo: (params = {}) => vm.$u.post(config.adminPath+'/wx/user/wxff3ba19a26d2069f/uapdateUserInfo', params),
		getUserVillage:(params = {}) => vm.$u.get(config.adminPath+'/mobile/wechat/address/getSysUserVillageByUserId', params),
		
		//睦邻议事
		chatAdd:(params = {}) => vm.$u.post(config.adminPath+'/mobile/neighbourMeeting/selectNeighbordetails', params), //新增
		chatDel:(params = {}) => vm.$u.delete(config.adminPath+'/mobile/neighbourMeeting/deletemeetingname', params),
		chatInfoDetail:(params = {}) => vm.$u.get(config.adminPath+'/mobile/neighbourMeeting/selectNeighbordetails', params),
		chatList:(params = {}) => vm.$u.get(config.adminPath+'/mobile/neighbourMeeting/selectNeighborlist', params),
		chatUserInfo:(params = {}) => vm.$u.get(config.adminPath+'/mobile/neighbourMeeting/selectmeetingname', params),
		
		//小区管理人员信息
		PropertyInfo: (params = {}) => vm.$u.get(config.adminPath+'/communityManager/district/selectproperty/list', params),
		GridInfo: (params = {}) => vm.$u.get(config.adminPath+'/communityManager/district/gridleader/list', params),
		CommitteeInfo: (params = {}) => vm.$u.get(config.adminPath+'/communityManager/district/selectcommitee/list', params),
		AutonomousInfo: (params = {}) => vm.$u.get(config.adminPath+'/communityManager/district/auto/list', params),
		
		//消息页相关api
		listNotice: (params={}) => vm.$u.get(config.adminPath+'/mobile/notice/selectNoticeList',params),
		noticeDetail:(params={}) => vm.$u.get(config.adminPath+'/mobile/notice/'+params.noticeId),
		//睦邻评价接口
		evaluationRecords:(params = {}) => vm.$u.post(config.adminPath+'/mobile/evaluation/evaluationRecords', params),
		evaluationPercent:(params={}) => vm.$u.get(config.adminPath+'/mobile/evaluation/evaluationPercent',params),
		whetherEvaluation:(params={}) => vm.$u.get(config.adminPath+'/mobile/evaluation/whetherEvaluation',params),
		
		//基础信息相关api
		CommunityList:(params={}) => vm.$u.get(config.adminPath+'/mobile/dictionary/wechatcommunitylist',params),
		VillageList:(params={}) => vm.$u.get(config.adminPath+'/mobile/dictionary/wechatvillagelist',params),
		
		//社区地址信息相关api
		addressInfo: (params={}) => vm.$u.get(config.adminPath+'/mobile/wechat/address/list',params), 	//用户地址列表查看
		addressAdd: (params={}) => vm.$u.post(config.adminPath+'/mobile/wechat/address/addaddress',params),		//用户地址新增
		addressDetailInfo: (params={}) => vm.$u.get(config.adminPath+'/mobile/wechat/address/'+params.id),	//用户地址详细信息查看
		addressModify: (params={}) => vm.$u.put(config.adminPath+'/wx/user/wxff3ba19a26d2069f/updateAddress',params),		//用户地址修改
		addressDelete: (params={}) => vm.$u.delete(config.adminPath+'/mobile/wechat/address/'+params.id),	//用户地址删除
		
		//地址默认修改
		addmorenModify:(params={}) => vm.$u.post(config.adminPath+'/wx/user/wxff3ba19a26d2069f/updateMorenSysInfo',params),
		
		//随手拍相关api
		photoGet: (params={}) => vm.$u.get(config.adminPath+'/mobile/wechat/feedback/selectmobilebacklist2',params),
		photoAdd: (params={}) => vm.$u.post(config.adminPath+'/mobile/wechat/feedback/add2',params),
		photoDetailInfo: (params={}) => vm.$u.get(config.adminPath+'/mobile/wechat/feedback/'+params.id),
		photoModify: (params={}) => vm.$u.put(config.adminPath+'/mobile/wechat/feedback',params),
		photoDelete: (params={}) => vm.$u.delete(config.adminPath+'/mobile/wechat/feedback/'+params.id),
		myphotoGet: (params={}) => vm.$u.get(config.adminPath+'/mobile/wechat/feedback/selectmobilebacklist',params), 
		photoFeedback:(params={}) => vm.$u.put(config.adminPath+'/mobile/feedback/updateMobileFeedback',params),
		photosendCode:(params={}) => vm.$u.get(config.adminPath+'/sms/sendCode',params), 
		photoCommunity:(params={}) => vm.$u.get(config.adminPath+'/mobile/dictionary/wechatcommunitylistMoren',params), 
		photoVillage:(params={}) => vm.$u.get(config.adminPath+'/mobile/dictionary/wechatvillagelistMoren',params), 
	};
	
}

export default {
	install
}