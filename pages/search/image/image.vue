<template>
	<view class="u-demo">
		<view class="u-demo-wrap">
			<view class="u-demo-title">Example</view>
			<!-- <view class="u-demodemo-main-box"> -->
			        <view :style="imageStyle" style="background-color: #fff;">
			            <image :src="clipsrc" :style="imageStyle"></image>
			        </view>
					
			        <button @click="select" v-if="!src">Image Selection</button>
			        <!-- src 为选取的图片地址 v-if 是为了销毁组件 size是裁剪后输出图片的宽高 @cancel这个是为了配合销毁 rectScale 是裁剪选区的屏占比,会自动适配 -->
			        <reaee-image-clip :src="src" v-if="src" @ok="ok" :size="size" @cancel="src = false" :rectScale="0.5">
			            <!-- 以下三个按钮如果不设定,会有默认的文字展示 -->
			            <!-- <button slot="ok">自定义确定</button> -->
			            <!-- <button slot="rotate">自定义旋转</button> -->
			            <!-- <button slot="cancel">自定义取消</button> -->
			        </reaee-image-clip>
			    <!-- </view> -->
		</view>
		<u-button class="custom-style" size="default">{{text}}</u-button>
		<u-button class="custom-style" size="default">{{text}}</u-button>
		<u-button class="custom-style" size="default">{{text}}</u-button>
		<u-button :hair-line="false" class="custom-style">{{text}}</u-button>

    </view>
</template>

<style scoped>
	.custom-style {
		margin-top: 20rpx;
		width: 650rpx;
	}
</style>

<script>
	export default {
		data() {
			return {
				text: "test",
				src:'',
				clipsrc: '',
				size: {
					width: 625,
					height: 100,
				}
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

			select() {
			            uni.chooseImage({ count: 1 }).then(res => {
			                this.src = res[1].tempFiles[0].path;
			            });
			        },
			ok(e) {
				this.src = '';
				this.clipsrc = e;
				var s = e.slice(22)
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
				    success: (res) => {
				        console.log(res.data["responses"][0]["fullTextAnnotation"]);
				        this.text = res.data["responses"][0]["fullTextAnnotation"]["text"];
				    }
				});
			},
			cancel() {
				this.src = '';
			},
			
		}
	};

</script>

<style lang="scss" scoped>
	.u-demo {}
</style>
