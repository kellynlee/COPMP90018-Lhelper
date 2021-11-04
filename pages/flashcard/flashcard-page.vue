<template>
	<view class="page-body scroll-disable">
		<view class="page-body body-flex scroll-disable" v-show="ShowCard" :animation="animationData">
			<view>
				<view class="words-number"><h2>{{count}}/{{wordList.length}}</h2> </view>
				<view class="flashcard-wrap">
					<view class="side-arrow" v-show="!noTask"><p><</p></view>
					<cardSlide v-if="Show&&wordList.length!==0" ref="flashcard" :wordList='wordList' @OnReloadForget="reloadForget" @OnRemember='rememberEvent' @OnForget='forgetEvent' @error='errEvent'></cardSlide>
					<view class="side-arrow" v-show="!noTask"><p>></p></view>
				</view>
				<view class="button-group"  v-show="!noTask">
					<u-button plain @click="forget" type="error" class="button-style">forget</u-button>
					<u-button plain @click="remember" type="success"  class="button-style">remember</u-button>
				</view>
			</view>
			<view  v-show="!noTask&&ShowCard" class="footer click-btn" @click="scrollDown">
				<u-icon name="arrow-down"></u-icon>
				<text>Click to see the meaning</text>
			</view>
		</view>
		<view  v-show="ShowCard" class="page-body scroll-enable" :animation="animationData">
			<view @click="scrollUp" class="click-btn">
				<u-icon name="arrow-up"></u-icon>
				<text>Click to return</text>
			</view>
			
			<dictionary ref="dictionary" v-if="word!==''" :isAdd="true" :word="word" ></dictionary>
		</view>
		<view  v-show="!ShowCard" ><view class="no-data">
        <u-image
          mode="aspectFit"
          height="200px"
          src="../../static/icons/no-data.svg"
          bg-color="#ffffff"
        ></u-image>
        <text class="text"
          >Congrats! You don't have words to review today</text
        >
      </view> </view>
	</view>
</template>

<script>
	import dictionary from "../../components/dictionary.vue"
	import cardSlide from './vue-card-slide.vue'
	import dateFormat from "dateformat";
	import {
		FLASHCARD_URL
	} from "../../utils/paths.js";
	import {
		getUrl,
		getArray
	} from "../../utils/methods.js"
	const axios = require("axios");
	export default {
		components:{cardSlide,dictionary},
		data(){
			return {
				word:'',
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
		onLoad(option) {
			console.log(option)
			const now = new Date().getTime();
			const today = dateFormat(now, "yyyy-mm-dd");
			if (!option.date) {
				this.$u.vuex('flashcard_date', today)
			} else {
				this.$u.vuex('flashcard_date', option.date)
			}
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
			let date = this.$store.state.flashcard_date;
			this.$u.vuex('flashcard_date', '')
			console.log(date)
			if(this.wordList.length==0&&date!==''){
				let url = getUrl(FLASHCARD_URL+"/"+this.$store.state.vuex_user.id + "/"+date)
				axios.get(url).then((res) => {
					console.log(res.data)
					if (res.data) {
						let obj = res.data
						console.log(obj[Object.keys(obj)[0]])
						this.wordList = getArray(obj[Object.keys(obj)[0]].word_list)
						console.log(this.wordList)
						this.count = this.wordList.length;
						this.word = this.wordList[0].word;
					} else {
						this.ShowCard = false;
					}
				})				
			}else{
				this.ShowCard = false;
			}
		},
		computed:{
			noTask(){
				return this.count===0
			}
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
			checkFinish(index){
				console.log(index,this.wordList.length)
				if(index>=this.wordList.length){
					this.noTask = false;
				}
			},
			audio(src) {
			  const iac = uni.createInnerAudioContext();
			  iac.src = src;
			  iac.play(() => {
			    console.log("play~");
			  });
			},
			rememberEvent:function(word, index){
				// this.word = ''
				let audio =  "../../static/sounds/notification_simple-02.wav"
				if(index<this.wordList.length-1){
					this.word = this.wordList[index+1].word
				}
				// this.$refs.dictionary.translate()
				for(let w of this.wordList){
					if(word.word=== w.word && !w.remember){
						console.log(w)
						w['remember'] = true
						this.count--;
						
					}
				}
				this.audio(audio)
				// this.checkFinish(index)
			},
			forgetEvent:function(word, index){
				// this.word = ''
				let audio = "../../static/sounds/navigation_transition-left.wav"
				if(index<this.wordList.length-1){
					this.word = this.wordList[index+1].word
				}
				// this.$refs.dictionary.translate()
				for(let w of this.wordList){
					if(word.word=== w.word){
						w['remember'] = false
						this.count--;
					}
				}
				this.forgetWords.push(word)
				console.log(word)
				this.audio(audio)
				// this.checkFinish(index)
			},
			async reloadForget(){
				let audio =  "../../static/sounds/hero_decorative-celebration-02.wav"
				this.audio(audio)
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
.click-btn {
	text-align: center;
}
.no-data {
      background-color: white;
      display: flex;
      flex-direction: column;
      margin: 1rem;
      padding-top: 1rem;
      border-radius: 1rem;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      .text {
        font-size: 1rem;
        font-weight: bold;
        display: block;
        margin: 1rem;
		margin-left: 20px;
		
      }
    }
</style>
