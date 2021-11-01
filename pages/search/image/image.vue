<template>
	<view class="u-demo">
		
		<view>
				<div class="bor" :style="imageStyle">
					<image v-if="path" :style="imageStyle" :src="path"></image>
				</div>
				<button class="image-selection" @tap="chooseImage()">Select Image</button>
				
		        
				<kps-image-cutter @ok="onok" @cancel="oncancle" :blob=false :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
		</view>

		</u-grid>
		<view v-for="(item,index) in textLst" :key="index">
			<u-button class="button" size="default">{{item}}</u-button>
		</view>
		

    </view>
</template>

<style scoped>
	.button {
		margin-top: 20rpx;
		width: 650rpx;
	},
	.image-start{
		margin-top: 10rpx;
	}
	.image-selection{
		margin:20rpx;
		/* border: #000000; */
	},
	.image {
		margin: 28rpx;
	},
	.bor{
		border:1rpx dashed #78827f;
		margin-left:20rpx;
		margin-right:20rpx;
		}
</style>

<script>
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	import { pathToBase64, base64ToPath } from '@/common/imagetools.js'
	
	export default {
		components:{kpsImageCutter},
		data() {
			return {
				textLst:["test1","test2"],
				text: "test",
				src:'',
				clipsrc: '',
				size: {
					width: 700,
					height: 200,
				},
				url: "",
				path: "",
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

			chooseImage() {
			                uni.chooseImage({
			                    success: (res) => {
			                        // 设置url的值，显示控件
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
			
		
			
		}
	};

</script>

