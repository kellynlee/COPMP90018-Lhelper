<!-- 
This is the voice search page, in this page, we use the microphone to get voice and convert to word
 -->
<template>
	<view>

		
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger" @fabClick="fabClick" />
		 
		<u-popup v-model="showPopUp" mode="center" border-radius="14">
		 		<h3 class="popup-title">
		 			Voice Recording
		 		</h3>
				<button class="voice-button" @longpress="startRecognize" @touchend="stopRecognize">Long Press To Record</button>
		</u-popup>
		
	
		
	</view>
</template>
<style>
	.popup-title{
		text-align:center;
		margin-top: 30rpx;
	},
	.voice-button {
		margin: 20rpx
	}
</style>
<script>
	
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	var _this;
	
	export default {
		
		data(){
			return {
				showPopUp: false,
				wordLst:[],
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#c7e5c8'
				},
				content: [{
						iconPath: '/static/icons/photo.png',
						selectedIconPath: '/static/icons/photo.png',
						text: 'Photo',
						active: false
					},
					{
						iconPath: '/static/sound-recording/voice.png',
						text: 'Voice',
						active: false
					},
				]
			}
		},

		methods: {
			
			trigger(e) {
				console.log(e)
				this.showPopUp = true
				// this.content[e.index].active = !e.item.active
				
			},
			fabClick() {
				uni.showToast({
					title: '点击了悬浮按钮',
					icon: 'none'
				})
			},
			
			startRecognize() {
				let _this = this;
				let options = {};
				_this.wordLst = [];
				options.engine = _this.speechEngine;
				options.punctuation = false;
				options.lang = "en-us";
				options.userInterface = false;
				_this.searchText = ""

				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
					console.log("result: "+_this.searchText);
					_this.wordLst.push(s)
				}, function(e){
					console.log(e.message);
				});
			},
			stopRecognize() {
				setTimeout(function(){plus.speech.stopRecognize();}, 2000)
			},
		}
	}   
</script>