<template>
	<view class="main-body">
		<!-- <button type="default" @click="test">image</button> -->
		<view class="u-demo-wrap search-page-body">
			<view class="search-page-header animation" v-show="!onFocus" :animation="animationData">
				<view class="logo">
					<image src="../../static/icons/logo.svg" />
				</view>

				<view class="title">Welcome to L-Helper, you can search a word by taking photo,
					speaking and typing!
				</view>
				<u-row class="search">
					<u-col span="12">
						<button class="btn uni-button" @click="searchImage">
							<u-icon class="image-button" name="camera"></u-icon>
							/
							<u-icon class="voice-button" name="mic"></u-icon>
						</button>
					</u-col>
				</u-row>
				<!-- <u-button @click="login">Login</u-button> -->
			</view>
			<view class="u-demo-area ">
				<u-row>
					<u-col :span="10" :offset="1" stop>
						<u-search v-model="value" @focus="getFocus" @blur="loseFocus" @change="change"
						@search="change"
							:action-style="activeBtnStyle" :shape="'square'"
							:clearabled="true" :show-action="true" action-text="Search"
							placeholder="please input the words" @clear="clear"></u-search>
					</u-col>
				</u-row>
			</view>
			<u-row v-if="onFocus" class="word-selection" style="align-items: flex-start">
				<u-col :span="10" :offset="1" stop>
					<u-swipe-action @open="open(item)" :index="index" v-for="(item, index) in list1" 
						:show="item.show" :btn-width="151" @close="close" :options="options"
						:disabled="item.show" @content-click="contentClick(item)">
						<view class="item u-border-bottom">
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view class="title-wrap word-item">
								<text class="title u-line-2">{{ item.title }}</text>
								<text class="word-decs">{{ item.desc }}</text>
							</view>
							<u-icon @click.native.stop="cancelCollected(item)" :name="!item.collected ? 'star' : 'star-fill'"
								size="40" :color="!item.collected ? '#909399' : '#90caf9'"></u-icon>
							<!-- <u-icon v-if="item.collected" @click="cancelCollected(item)" name="star-fill" size="40" color="#FF9900"></u-icon> -->
							<!-- <image style="justify-items: flex-end;" mode="aspectFill" :src="item.images" /> -->
						</view>
					</u-swipe-action>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script type="text/javascript">
	import {
		GLOSSARY_URL
	} from "../../utils/paths.js";
	import {
		getUrl,
		getArray
	} from "../../utils/methods.js";
	import {
		getGlossary, addGlossary, deleteGlossary
	} from "../glossary/glossary-service.js";
	import {request} from '../../utils/methods.js'
	import dictionary from './dictionary.json'
	export default {

		onUnload() {
			this.animationData = {}
			// 页面关闭后清空数据
		},
		onLoad() {
			this.animation = uni.createAnimation()
			console.log("test")
			if (!this.$store.state.vuex_user.id) {
				this.$u.route("/pages/user/login");
			}
			// 创建动画实例
		},
		onShow() {
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			console.log("test1")
			console.log(this.$store.state.vuex_user)
			// if (!this.$store.state.vuex_user.id) {
				// this.$u.route("/pages/user/login");
			// }
			this.animation = animation
		},
		async mounted() {
			this.userId = this.$store.state.vuex_user.id;
			if(this.userId!==undefined){
				this.glossaryList = await getGlossary(this.userId)
			}
		},
		methods: {
			login() {
				this.$u.route("/pages/user/login");
			},
			cancelCollected: async function(item) {
				// event.stopPropagation()
				item.collected = false
				// item.collected = true;
				item.show = false;
				let cancelWord = {};
				for (let word of this.glossaryList) {
					if (word.word === item.title) {
						 cancelWord = word
					}
				}
				console.log(cancelWord)
				if(cancelWord.id!==undefined){	
					deleteGlossary(this.userId,cancelWord.id)
					
				}
				this.glossaryList = await getGlossary(this.userId)
			},
			getFocus: function() {
				// this.onFocus = true;
				this.animation.height(0).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
				setTimeout(() => {
					this.onFocus = true;
				}, 300)
				// this.onFocus = true;
			},
			clear() {
				this.animation.height(400).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
				this.onFocus = false;
			},
			loseFocus: function() {
				// this.animation.height(300).step()
				// // 导出动画数据传递给data层
				// this.animationData = this.animation.export()
				// this.onFocus = false;
			},
			contentClick(item){
				this.$u.route("/pages/search/search-translate?word="+item.title);
			},
			searchImage() {
				this.$u.route({
				  url: "/pages/search/image/image",
				});
			},
			searchVoice() {
				this.$u.route({
				  url: "/pages/search/voice/voice",
				});
			},
			close: function() {},
			async open(item) {
				for (let word of this.glossaryList) {
					if (word.word === item.title) {
						 return
					}
				}
				item.collected = true;
				item.show = false;
				const url = GLOSSARY_URL+"/"+this.$store.state.vuex_user.id;
				let myDate = new Date();
				console.log(item)
				let word = {added_time:myDate.getDate()+"/"+myDate.getMonth()+"/"+myDate.getFullYear(),forget:0,hit:0,star:true,word:item.title}
				await addGlossary(this.userId, word)
				this.glossaryList = await getGlossary(this.userId)

			},
			apply(){},
			change: async function() {
				let result = [];
				for (let word in dictionary) {
					// console.log(this.value)
					// console.log(word.substr(0, this.value.length),this.value)
					if (word.substr(0, this.value.length)=== this.value) {
						
						let collected = false;
						for (let item of this.glossaryList) {
							if (item.word === word) {
								collected = true
							}
						}
						result.push({
							title: word,
							// desc:'',
							desc: dictionary[word].substring(0, 20) + (dictionary[word].length > 20 ? '...' :''),
							show: false,
							collected: collected
						})
						if (result.length == 40) {
							break;
						}
					}
				}
				this.list1 = result;
				console.log(result)
				// console.log(this)


			},
			test() {
				this.$u.route({
					url: "/pages/search/image/image"
				})
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index === 1) {
				this.$u.route({
					url: "/pages/search/image/image"
				})
			} else {
				this.$u.route({
					url: "/pages/search/voice/voice"
				})
			}
			// uni.showToast({
			// 	title: e.index === 0 ? "你点了分享按钮" : "你点了收藏按钮",
			// 	icon: "none"
			// })
		},
		data: () => {
			return {
				glossaryList: [],
				onFocus: false,
				value: '',
				list1: [
					// 	{
					// 		id: 1,
					// 		title: 'Words',
					// 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
					// 		desc: 'test',
					// 		show: false,
					// 		collected: false
					// 	},
					// 	{
					// 		id: 2,
					// 		title: 'Words',
					// 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
					// 		desc: 'test',
					// 		show: false,
					// 		collected: false
					// 	},
				],
				activeBtnStyle:{ 
								width: '3.25rem', 
								color: '#ffffff',
								background:'#90caf9',
								height:'30px',
								lineHeight:'30px',
								borderRadius:'0.5rem',
								boxShadow:'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
								},
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

<style lang="scss" scoped>
	.image-button{
		margin-right: 20rpx;
	}
	.voice-button{
		margin-left: 20rpx;
	}
	.search-page-header {
		height: 400px;
		margin: 1rem;
		background-color: white;

		.logo {
			text-align: center;
			image{
				width: 200px;
				height: 200px;
			}
		}

		.title {
			text-align: left;
			display: block;
			margin: 1rem;
		}

		.search {
			.btn {
				background-color: #c8e6c9;
				font-size: 1rem;
				color: white;
				box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
					rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
				border-radius: 0.8rem;
			}

			.uni-button:after {
				border: none;
			}
		}
	}

	.main-body {
		height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1rem;
		background-color: white;
		border-radius: 1rem;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
			rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
	}

	.u-demo-area {
		margin-top: 0.625rem;
	}

	uni-page-body {
		height: 100%;
	}

	.u-action-active {
		width: 50px;
	}

	.u-action {
		width: 50px;
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
		overflow: hidden;
		color: #606266;
		margin-left: 9px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.search-page-body {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
</style>
