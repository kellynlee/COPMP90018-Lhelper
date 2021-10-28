<template>
	<view class="main-body">
		<view class="u-demo-wrap search-page-body" >
			<view>
				<view class="search-page-header animation" v-show="!onFocus" :animation="animationData">
					<view class="u-demo-title">Welcome to L-Helper</view>
					<u-row>
						<u-col :span="10" :offset="1" stop>
							<image mode="heightFix" src="https://cdn.uviewui.com/uview/common/logo.png" />
						</u-col>
					</u-row>
				</view>
				<view class="u-demo-area">
					<u-row>
						<u-col :span="10" :offset="1" stop>
							<u-search v-model="value" @focus="getFocus" @blur="loseFocus" @change="change" :action-style="{width:'50px',color:'#007aff'}" @custom="custom"
								@search="search" :shape="'square'" :clearabled="true" :show-action="true"
								action-text="Search" placeholder="please input the words" @clear="clear"></u-search>
						</u-col>
					</u-row>
				</view>
			</view>
			<u-row v-if="onFocus" class="word-selection" style="align-items: flex-start;">
				<u-col :span="10" :offset="1" stop>
					<u-swipe-action @open="open(item)" :index="index" v-for="(item, index) in list1" :key="item.id"
						:show="item.show" @click="click" :btn-width="151" @close="close" :options="options"
						:disabled="item.show"
						@content-click="contentClick">
						<view class="item u-border-bottom">
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view class="title-wrap word-item">
								<text class="title u-line-2">{{ item.title }}</text>
								<text class="word-decs">{{ item.desc }}</text>
							</view>
							<u-icon v-if="!item.collected" name="star" size="40" color="#909399"></u-icon>
							<u-icon v-if="item.collected" @click="cancelCollected(item)" name="star-fill" size="40" color="#FF9900"></u-icon>
							<!-- <image style="justify-items: flex-end;" mode="aspectFill" :src="item.images" /> -->
						</view>
					</u-swipe-action>
				</u-col>
			</u-row>
		</view>

	</view>

</template>

<script type="text/javascript">
	export default {
		
		onUnload() {
			this.animationData = {}
			// 页面关闭后清空数据
		},
		onload() {
			this.animation = uni.createAnimation()
			console.log("test")
			// 创建动画实例
		},
		onShow() {
			// 初始化一个动画
			var animation = uni.createAnimation({
			                duration: 300,
			                timingFunction: 'ease-out',
			            })
			console.log("test1")
			this.animation = animation
			
		},
		methods: {
			cancelCollected: function(item){
				item.collected = false
			},
			getFocus:function(){
				this.animation.height(0).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
				setTimeout(()=>{this.onFocus = true;},300)
				// this.onFocus = true;
			},
			loseFocus:function(){
				this.animation.height(300).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
				this.onFocus = false;
			},
			close:function(){},
			open: function(item){
				item.collected = true;
				item.show = false;
				
			},
			change: function(){
				// console.log(this)
				this.animation.bottom('-100%').step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()

			}
		},
		data: () => {
			return {
				onFocus: false,
				value: '',
				list1: [{
						id: 1,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 2,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 3,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 4,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 5,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 6,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 7,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 8,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 9,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 10,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 11,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 6,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 7,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 8,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 9,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 10,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					},
					{
						id: 11,
						title: 'Words',
						images: 'https://cdn.uviewui.com/uview/common/logo.png',
						desc: 'test',
						show: false,
						collected:false
					}
				],
				animationData: {},
				options: [
					// {
					// 	text: 'Todo',
					// 	style: {
					// 		backgroundColor: '#007aff'
					// 	}
					// },
					{
						text: 'Glosssary',
						style: {
							backgroundColor: '#FF9900'
						}
					}
				]
			}
		}
	}
</script>

<style scoped>
	.search-page-header {
		/* display: none; */
		height: 300px;
	}

	.main-body {
		height: 100%;
	}

	uni-page-body {
		height: 100%;
	}

	.u-action-active {
		width: 50px
	}

	.u-action {
		width: 50px
	}

	.item {
		justify-content: space-between;
		display: flex;
		padding: 20rpx;
	}

	.word-item {
		margin-left: 10px;
	}

	.word-selection {
		margin-top: 20px;
		height: 100%;
		align-items: start;
		overflow: auto;
	}

	.word-decs {
		color: #606266;
		margin-left: 9px;
	}

	.search-page-body {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
</style>
