<template>
	<view>
		<view class="words-number"><h2>12/23</h2> </view>
		<view class="flashcard-wrap">
			<view class="side-arrow"><p><</p></view>
			<cardSlide v-if="Show" ref="flashcard" :wordList='wordList' @OnReloadForget="reloadForget" @OnRemember='rememberEvent' @OnForget='forgetEvent' @error='errEvent'></cardSlide>
			<view class="side-arrow"><p>></p></view>
		</view>
		<view class="button-group">
			<u-button plain @click="forget" type="error" class="button-style">forget</u-button>
			<u-button plain @click="remember" type="success"  class="button-style">remember</u-button>
		</view>
	</view>
</template>

<script>
	import cardSlide from './vue-card-slide.vue'
	export default {
		components:{cardSlide},
		data(){
			return {
				Show:true,
				wordList:[
					{word:"test1"},
					{word:"test2"},
					{word:"test3"},
					{word:"test4"},
					{word:"test5"},
					{word:"test6"},
					{word:"test7"},
					{word:"test8"},
					{word:"test9"},
					// {word:"test10"},
					// {word:"test11"},
					// {word:"test12"},
					// {word:"test13"},
					// {word:"test14"},
					// {word:"test15"},
					// {word:"test16"},
					// {word:"test17"},
					// {word:"test18"},
					// {word:"test19"},
					// {word:"test20"},
				],
				forgetWords:[]
			}
		},
		methods:{
			forget:function(){
				this.$refs.flashcard.success();
			},
			remember:function(){
				this.$refs.flashcard.error();
			},
			rememberEvent:function(word){
				// console.log(word)
			},
			forgetEvent:function(word){
				this.forgetWords.push(word)
				console.log(word)
			},
			async reloadForget(){
				this.wordList = this.forgetWords;
				this.forgetWords = []
				this.Show= false
				// 建议加上 nextTick 微任务 
				// 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
				await this.$nextTick(function(){
					// 加载
					this.Show= true
				})
			}
			
		}
		
	};
</script>

<style scoped>
.flashcard-wrap{
	margin-top: 40px;
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
	margin-top: 30px;
	text-align: center;
}
</style>
