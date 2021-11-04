<template>
	<view class="photo-page">
		<view class="photo-area">
				<view class="bor" :style="imageStyle">
					<image v-if="path" :style="imageStyle" :src="path"></image>
					<view class="text">{{tips}}</view>
				</view>				
		</view>
		<u-loading :show="!isLoad"></u-loading>
		<transition name="fade">
			<view class="selection-area" v-if="textLst.length>0">
				<text>Please select the word to see the dictionary</text>
				<view v-for="(item,index) in textLst" :key="index" class="select-item">
					<u-button class="button uni-button" @click="goDictionary(item)" >{{item}}</u-button>
				</view>
			</view>
		</transition>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :blob=false :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
		
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger" />
		 
		<u-popup v-model="showPopUp" mode="center" border-radius="14">
		 		<h3 class="popup-title">
		 			Voice Recording
		 		</h3>
				<button class="voice-button" @longpress="startRecognize" @touchend="stopRecognize">Long Press To Record</button>
		</u-popup>
  </view>
</template>

<style lang="scss" scoped>
	.text{
		margin: 20rpx;
		}
	.popup-title{
		text-align:center;
		margin-top: 30rpx;
	}
	.voice-button {
		margin: 20rpx
	}
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
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	import { pathToBase64, base64ToPath } from '@/common/imagetools.js'
	
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	var _this;
	
	export default {
		components:{kpsImageCutter},
		data() {
			return {
				tips:"Please Click the Button in the bottom right corner to Start",
				textLst:[],
				text: "test",
				btnText:"Take Photo",
				size: {
					width: 600,
					height: 300,
				},
				isLoad:true,
				url: "",
				path: "",
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
		computed: {
		        imageStyle() {
		            return {
		                width: this.size.width + 'rpx',
		                height: this.size.height + 'rpx',
		            };
		        }
		    },
			
		methods: {

			goDictionary(item) {
				uni.navigateTo({
				    url: '/pages/search/search-translate?word='+item
				});
			},
			chooseImage() {
			                uni.chooseImage({
			                    success: (res) => {
			                        // 设置url的值，显示控件
									this.btnText = "Retake"
			                        this.url = res.tempFilePaths[0];
			                    }
			                });
			            },
			onok(ev) {
				this.path = ev.path;
				this.url = "";
				this.size.height = Math.ceil(ev.height/ev.width * 700)
				console.log(ev.width, ev.height)
				pathToBase64(ev.path)
				  .then(base64 => {
					console.log(this.path.length)
					if (this.path.length<200){
						console.log("less than 200")
						this.path = base64
						}
					var s = this.path.slice(22)
					// console.log(s);
					this.isLoad = false;
					uni.request({
					    url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCB517fv6zesTMgtXx9mPjgeVccBuncSsE', //仅为示例，并非真实接口地址。
					    data: {
					        requests: [
								{
									image:{
										content: s
									},
									features:[{type:"TEXT_DETECTION"}]
								}
							]
					    },
						method: "POST",
					    header: {
					        'content-type': 'application/json' 
					    },
						timeout:10000,
					    success: (res) => {
							this.isLoad = true
					        console.log(res);
					        var s = res.data["responses"][0]["fullTextAnnotation"]["text"];
							var wordLst = s.toLocaleLowerCase().split(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\<\>\?\[\]\n\s123456789]/);
							this.textLst = [];
							for (var i=0;i<wordLst.length;i++){
								// var isletter = /^[a-zA-Z]+$/.test(wordLst[i]);
								// console.log(wordLst[i]);
								if (wordLst[i].length>1){
									this.textLst.push(wordLst[i])
								}
							};
							this.textLst = Array.from(new Set(this.textLst));
					    },
						fail: (res) => {
							console.log(res)
						}
					});
				  })
				  .catch(error => {
				    console.error(" error")
				  })
				
				// console.log(ev.path)
			},
			oncancle() {
				this.url = "";
			},
			
			
			
			trigger(e) {
				this.tips = ""
				console.log(e)
				if (e.index==0){
					this.chooseImage()
				}else{
					this.showPopUp = true
				}
				
				// this.content[e.index].active = !e.item.active
				
			},
			
			startRecognize() {
				
				this.path="";
				this.size.width=600;
				this.size.height=300;
				let _this = this;
				let options = {};
				_this.isLoad = false;
				_this.searchText = ""
				options.engine = _this.speechEngine;
				options.punctuation = false;
				options.lang = "en-us";
				options.userInterface = false;
				
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
					console.log("result: "+_this.searchText);
					_this.isLoad = true;
					var wordLst = s.toLocaleLowerCase().split(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\<\>\?\[\]\n\s123456789]/);
					_this.textLst = [];
					for (var i=0;i<wordLst.length;i++){
						// var isletter = /^[a-zA-Z]+$/.test(wordLst[i]);
						// console.log(wordLst[i]);
						if (wordLst[i].length>1){
							this.textLst.push(wordLst[i])
						}
						
					};
					_this.textLst = Array.from(new Set(this.textLst));
				}, function(e){
					console.log(e.message);
				});
			},
			stopRecognize() {
				setTimeout(function(){plus.speech.stopRecognize();}, 2000)
			},
		
		},

	};

</script>

