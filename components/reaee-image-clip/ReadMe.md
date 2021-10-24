### 图片裁剪工具  
  
#### 兼容性:

	Android,H5, [ IOS未测试 ]

#### 简介:

	流畅,极简,无多余另类功能,操作直观,响应敏捷;
	
	单指滑动,调整裁剪区域;

	双指缩放,调整图片大小;

	自动适配裁剪框大小;
	
	不限制图片大小,多大的图片都能裁 ;

	不限制裁剪区域大小,输出多大的图片都行,不限制;

	限制图片滑出裁剪区域,图片随意流畅滑动,不会让裁剪区域截取到图片外边,出现裁剪不完整的情况;

	限制图片缩放的比裁剪区域小,双指滑动可无限放大,双指缩小后,不会缩到不能填充满裁剪框;

	限制图片旋转角度 [ 0,90,180,270 ]

#### 注意: 
	
	当事件 ok | cancel 发生时,本组件应该销毁,此组件销毁请使用 v-if ,使用v-show会出问题,因为v-show只是隐藏了本组件,并未销毁  
	
#### 关于:

	版本:	v1.3  
	邮箱:	zzjxfj@163.com
	发布时间:	2020.11.29
	
#### 简要示例:

	最下面有完整示例 此处是简要示例
	
```
	
	<reaee-image-clip :src='src' v-if='src'  @ok='ok' :size='size' @cancel='src=false'></reaee-image-clip>
	
```

#### 数据原型

```

	//图片文件路径或url,
	src: {
		type: String,
		required: true
	},
	//想要裁剪的规格大小,单位px,裁剪后输出图片的长宽就在这里设置,默认200 x 200;单位为px,不需要传单位;例:{width:200,height:200}  
	size: {
		type: Object,
		default: () => {
			return {
				width: 200,
				height: 200
			};
		}
	},
	//裁剪框在屏幕上的占比,会根据 此值 & 裁剪规格 & 手机屏幕规格 进行适配
	rectScale:{
		type:Number,
		default:0.6
	}
	
```

#### 事件原型

```

	//	@cancel
	doCancel(){
		this.$emit('cancel');
	},
	//	@ok e为输出的Base64编码图片
	updateImage(e) {
		this.$emit('ok', e);
	},

```

#### 功能按钮样式原型

```

	<view  @click="doCancel" >
		<slot name='cancel'>
			<view style="color: #fff; margin: 30rpx;">取消</view>
		</slot>
	</view>
	<view  @click="doRotate" >
		<slot name='rotate'>
			<view style="color: #fff; margin: 30rpx;">旋转</view>
		</slot>
	</view>
	<view  @click="ok" >
		<slot name='ok'>
			<view style="color: #fff; margin: 30rpx;">确定</view>
		</slot>
	</view>
	
```

#### 完整应用示例:

```
<template>
	<view class="demo-main-box">
		<view :style="imageStyle" style="background-color: #036;">
			<image :src="clipsrc" :style="imageStyle"></image>
		</view>
		<button @click="select" v-if="!src">选取图片</button>
		<!-- src 为选取的图片地址 v-if 是为了销毁组件 size是裁剪后输出图片的宽高 @cancel这个是为了配合销毁 rectScale 是裁剪选区的屏占比,会自动适配 -->
		<reaee-image-clip :src="src" v-if="src" @ok="ok" :size="size" @cancel="src = false" :rectScale="0.5">
			<!-- 以下三个按钮如果不设定,会有默认的文字展示 -->
			<!-- <button slot="ok">自定义确定</button> -->
			<!-- <button slot="rotate">自定义旋转</button> -->
			<!-- <button slot="cancel">自定义取消</button> -->
		</reaee-image-clip>
	</view>
</template>

<script>
export default {
	data() {
		return {
			src: '',
			clipsrc: '',
			size: {
				width: 600,
				height: 800
			}
		};
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
		},
		cancel() {
			this.src = '';
		}
	}
};
</script>

<style >
	.demo-main-box {
		background-color: #efefef;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		width: 100vw;
		height: 100vh;
	}
</style>

```

