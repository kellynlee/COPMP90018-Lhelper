<template>
	<view class="photo-page">
		<view class="photo-area">
				
			<button class="image-selection uni-button" @longpress="startRecognize" @touchend="stopRecognize">{{btnText}}</button>
				
		</view>
		<transition name="fade">
			<view class="selection-area" v-if="textLst.length>0">
				<text>Please select the word to see the dictionary</text>
				<view v-for="(item,index) in textLst" :key="index" class="select-item">
					<u-button class="button uni-button" >{{item}}</u-button>
				</view>
			</view>
		</transition>
	</view>
</template>

<style lang="scss" scoped>
	.photo-page {
		background-color: white;
		margin: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
		border-radius: 1rem;
		.photo-area {
			display: flex;
			flex-direction: column;
			margin: 1rem 0;
			.bor{
				border:1rpx dashed #78827f;
				}
			.image-selection{
				margin-top: 1rem;
				background-color: #90caf9;
				color: white;
			}
			.uni-button:after {
			  border: none;
			}
		}
		.selection-area {
			margin: 0 1rem 1rem 1rem;
			display: flex;
			flex-direction: column;
			.select-item {
				margin: 0.5rem 0;
				.button {
					background-color: #c8e6c9;
					color: white;
				}
				.uni-button:after {
				  border: none;
				}
			}
		}
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 0;
	}
	
	.image {
		margin: 28rpx;
	}
	
</style>

<script>
	import soundRecording from '@/components/sound-recording/sound-recording.vue';
		
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	var _this;
	
	export default {
		data() {
			return {
				textLst:[],
				btnText:"Long Press To Recognize",
			}
		},
			
		methods: {
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
								_this.textLst.push(s)
							});
						},
			stopRecognize() {
							setTimeout(function(){plus.speech.stopRecognize();}, 5000)
						},
			
		}
	};

</script>

