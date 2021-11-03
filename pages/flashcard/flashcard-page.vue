<template>
	<view class="page-body scroll-disable" v-show="ShowCard">
		<view class="page-body body-flex scroll-disable" :animation="animationData">
			<view>
				<view class="words-number"><h2>{{count}}/{{wordList.length}}</h2> </view>
				<view class="flashcard-wrap">
					<view class="side-arrow"><p><</p></view>
					<cardSlide v-if="Show&&wordList.length!==0" ref="flashcard" :wordList='wordList' @OnReloadForget="reloadForget" @OnRemember='rememberEvent' @OnForget='forgetEvent' @error='errEvent'></cardSlide>
					<view class="side-arrow"><p>></p></view>
				</view>
				<view class="button-group">
					<u-button plain @click="forget" type="error" class="button-style">forget</u-button>
					<u-button plain @click="remember" type="success"  class="button-style">remember</u-button>
				</view>
			</view>
			<view class="footer" @click="scrollDown"><p>scrollDown</p></view>
		</view>
		<view  class="page-body scroll-enable" :animation="animationData">
			<p @click="scrollUp">scrollUp</p>
			
		</view>
	</view>
</template>

<script>
	import cardSlide from './vue-card-slide.vue'
	import {
		FLASHCARD_URL
	} from "../../utils/paths.js";
	import {
		getUrl,
		getArray
	} from "../../utils/methods.js"
	const axios = require("axios");
	export default {
		components:{cardSlide},
		data(){
			return {
				ShowCard:true,
				animationData:{},
				count:0,
				Show:true,
				wordList:[
				],
				forgetWords:[]
			}
		},
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
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			this.animation = animation
		
		},
		created(){
			axios.get(getUrl(FLASHCARD_URL)).then((res) => {
				let obj = res.data[this.$store.state.vuex_user.id]['2021-11-03']
				console.log(obj[Object.keys(obj)[0]])
				this.wordList = getArray(obj[Object.keys(obj)[0]].word_list)
				console.log(this.wordList)
				this.count = this.wordList.length;
			})
		},
		computed:{
			
		},
		methods:{
			scrollDown:function(){
				console.log(this.animation)
				this.animation.translateY('-100%').step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
			},
			scrollUp(){
				console.log(this.animation)
				this.animation.translateY('0%').step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
			},
			forget:function(){
				this.$refs.flashcard.success();
			},
			remember:function(){
				this.$refs.flashcard.error();
			},
			rememberEvent:function(word){
				// console.log(word)
				
				for(let w of this.wordList){
					if(word.word=== w.word && !w.remember){
						console.log(w)
						w['remember'] = true
						this.count--;
						
					}
				}
			},
			forgetEvent:function(word){
				for(let w of this.wordList){
					if(word.word=== w.word){
						w['remember'] = false
					}
				}
				this.forgetWords.push(word)
				console.log(word)
			},
			async reloadForget(){
				this.$u.vuex('flash_words', this.wordList)
				this.$u.route("/pages/flashcard/Summary");
				// this.wordList = this.forgetWords;
				// this.forgetWords = []
				// this.Show= false
				// // 建议加上 nextTick 微任务 
				// // 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
				// await this.$nextTick(function(){
				// 	// 加载
				// 	this.Show= true
				// })
			}
			
		}
		
	};
</script>

<style scoped>
	.page-body{
		height: 100%;
	}
.flashcard-wrap{
	padding-top: 40px;
	display: flex;
	align-content: center;
	flex-direction: row;
	justify-content: space-evenly;
	
}
.side-arrow{
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	align-content: center;
	justify-content: center;
}
.button-group{
	margin-top: 100px;
	display: flex;
	flex-direction: row;
	justify-content:space-around;
}
.button-style{
	width: 200rpx;
}
.words-number{
	padding-top: 30px;
	text-align: center;
}
.scroll-disable{
	overflow: hidden;
}
.scroll-enable{
	overflow:scroll;
}
uni-page-body {
  height: 100%;
}
.footer{
	bottom: 0px;
	align-self:center
}
.body-flex{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
