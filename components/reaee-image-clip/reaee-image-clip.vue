<template>
	<view class="ct" style='position: fixed;left: 0; top: 0;z-index:999;'>
		<view :id="id" style="height: 100%;display: flex;flex-flow: column nowrap;" @touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend">
			<view class="ct cbt"></view>
			<view class="bc tb"> 单指滑动 双指缩放 </view>
			<view class="cs">
				<view class="bc l"></view>
				<view class="cvbox" :style="boxStyle">
					<view :id="id + '_cmd'" style="display: none;" :draw="drawInfo" :change:draw="clipjs.doDraw"></view>
					<view class="imgbox" :style="imageBoxStyle" >
						<image :src='image_info.path' style="width: 100%;height: 100%;" ></image>
					</view>
				</view>
				<view class="bc r"></view>
			</view>
			<view class="bc b"></view>
		</view>
		<view style="width: 100%;line-height: 40rpx;display: flex;flex-flow: row nowrap;align-items: center;justify-content: space-between;background-color: rgba(0, 0, 0, 0.5);">
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
		</view>
		
	</view>
</template>
<script module="clipjs" lang="renderjs">
export default{
	methods:{
		doDraw(nv,ov,rinstance,instance){
			let {info,scale,imgSize,position,osize,bscale,rotate}=nv;
			let imageDom = new Image();
			imageDom.crossOrigin = '';
			imageDom.onload=()=>{
				let {width,height} = nv.osize;
				let canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				let ctx = canvas.getContext('2d');
				ctx.save();
				ctx.scale(bscale,bscale);
				ctx.rotate(rotate*Math.PI/180);
				switch(rotate){
					case 0 :
						ctx.drawImage(imageDom,0,0,info.width,info.height,position.x,position.y,imgSize.width,imgSize.height);
						break;
					case 90:
						ctx.drawImage(imageDom,0,0,info.width,info.height,position.y,-position.x,imgSize.width,imgSize.height);
						break;
					case 180:
						ctx.drawImage(imageDom,0,0,info.width,info.height,-position.x,-position.y,imgSize.width,imgSize.height);
						break;
					case 270:
						ctx.drawImage(imageDom,0,0,info.width,info.height,-position.y,position.x,imgSize.width,imgSize.height);
						break;
				}
				ctx.restore()
				let base64 = '';
				try{
					base64 = canvas.toDataURL();
				}catch(e){
					console.log(e);
				}
				rinstance.callMethod('updateImage',base64);
			}
			imageDom.src = info.path;
		},
	},
}
</script>
<script>
export default {
	//注意: 当事件 ok | cancel 发生时,本组件应该销毁,此组件销毁请使用 v-if ,使用v-show会出问题,因为v-show只是隐藏了本组件,并未销毁
	name: 'reaee-image-clip',
	props: {
		//图片文件路径或url,
		src: {
			type: String,
			required: true
		},
		//想要裁剪的规格大小,单位px,裁剪后输出图片的长宽就在这里设置
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
	},
	data() {
		return {
			//是否已挂载
			mountedStatus: false,
			//图片真实数据
			image_info: {},
			//图片定位
			top: 0,
			left: 0,
			//移动偏移量
			tTop: 0,
			tLeft: 0,
			//图片放大比例
			scale: 1,
			tScale:1,
			imgScale:1,
			boxScsle: 0,
			rotate:0,
			id: "reaee_image_clip",
			toucheStartValue: {},
			drawInfo: {}
		};
	},
	computed: {
		imageBoxStyle() {
			let s = {};
			s.top=this.cTop + 'px';
			s.left=this.cLeft  + 'px';
			s.width =this.cWidth + 'px';
			s.height=this.cHeight + 'px';
			s.transform = `rotate(${this.rotate}deg)`;
			s.transformOrigin = `0 0`;
			return s ;
		},
		boxStyle() {
			return {
				width: this.bWidth + 'px',
				height: this.bHeight + 'px'
			};
		},
		cTop() {
			return this.top + this.tTop;
		},
		cLeft() {
			return this.left + this.tLeft;
		},
		cWidth() {
			return this.image_info.width / (this.scale*this.tScale);
		},
		cHeight() {
			return this.image_info.height / (this.scale*this.tScale);
		},
		bWidth() {
			return this.size.width / this.boxScsle;
		},
		bHeight() {
			return this.size.height / this.boxScsle;
		}
	},
	watch: {
		image_info:{
			handler(){
				this.$nextTick(this.autoBoxScale);
			},
			deep:true
		}
	},
	methods: {
		initValue(){
			uni.getImageInfo({
				src: this.src
			}).then(res => {
				this.image_info = res[1];
			}).catch(e=>{
				this.doCancel();
			});
		},
		doCancel(){
			this.$emit('cancel');
		},
		updateImage(e) {
			this.$emit('ok', e);
		},
		doRotate(){
			let rotate = this.rotate;
			rotate += 90;
			rotate %= 360;
			this.$set(this,'rotate',rotate);
			this.$nextTick(this.autoBoxScale)
		},
		autoBoxScale() {
			if (!this.mountedStatus) return;		
			let { width, height } = this.size;
			let id = '#' + this.id;
			let select = uni.createSelectorQuery(this).in(this).select(id);
				select.boundingClientRect(data => {
					let sw = width / (data.width)/this.rectScale;
				let sh = height / (data.height)/this.rectScale;
				this.boxScsle = sw > sh ? sw : sh;
				this.$nextTick(this.autoScale)
				}).exec();
			if(this.boxScsle === 0){
				setTimeout(this.autoBoxScale,100);
			}
		},
		autoScale() {
			if (!this.mountedStatus) return;
			if(this.rotate == 90 || this.rotate == 270){
				let { width, height } = this.image_info;
				let sw = height / this.bWidth;
				let sh = width / this.bHeight;
				this.scale = sw < sh ? sw : sh;
				this.imgScale = this.scale;
			}else{
				let { width, height } = this.image_info;
				let sw = width / this.bWidth;
				let sh = height / this.bHeight;
				this.scale = sw < sh ? sw : sh;
				this.imgScale = this.scale;
			}			
			this.$nextTick(this.correctionLocationFinish)
		},
		ok() {
			let info = this.image_info;
			let osize = this.size;
			let scale = (this.scale*this.tScale);
			let bscale = this.boxScsle;
			let imgSize={width:this.cWidth,height:this.cHeight}
			let position={x:this.cLeft,y:this.cTop}
			let rotate = this.rotate;
			let clipInfo = { info, osize, scale,bscale,imgSize,position,rotate };
			this.drawInfo = clipInfo;
		},
		touchstart(e) {
			e.time=new Date().getTime();
			this.toucheStartValue = e;
		},
		distanceF(p1, p2) {
			let dx = Math.abs(p1.clientX - p2.clientX);
			let dy = Math.abs(p1.clientY - p2.clientY);
			return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		},
		toucheScale(e){
			let nowTouches = e.touches;
			let nowLong = this.distanceF(nowTouches[0],nowTouches[1]);
			let startTouches = this.toucheStartValue.touches;
			let startLong = this.distanceF(startTouches[0],startTouches[1]);
			let tScale = startLong/nowLong;
			this.tScale = tScale;
			this.tTop = 1;
			this.tLeft = 1;
		},
		correctionLocationFinish(){
			this.correctionLocation();
			this.top += this.tTop;
			this.left += this.tLeft;
			this.scale *= this.tScale;
			this.tScale = 1;
			this.tTop = 0;
			this.tLeft = 0;
		},
		correctionLocation(){
			//当前初始X
			let left = this.left;
			//当前初始Y
			let top = this.top;
			//X轴移动量
			let tLeft = this.tLeft;
			//Y轴移动量
			let tTop = this.tTop;
			//当前角度
			let rotate = this.rotate;
			//当前选框宽度
			let bWidth = this.bWidth;
			//当前选框高度
			let bHeight = this.bHeight;
			//当前图片宽度
			let iWidth = this.cWidth;
			//当前图片高度
			let iHeight = this.cHeight;
			
			if(this.imgScale < this.scale * this.tScale){
				this.tScale = this.imgScale/this.scale;
			}
			//如果旋转
			switch(rotate){
				case 90:
					if(left + tLeft - iHeight > 0){
						this.tLeft = iHeight - left ;
					}
					if(left + tLeft < bWidth ){
						this.tLeft = bWidth - left;
					}
					if(top + tTop + iWidth < bHeight){
						this.tTop = bHeight - top - iWidth ;
					}
					if(top + tTop > 0 ){
						this.tTop = - top;
					}
					break;
				case 180:
					if(left+tLeft > iWidth){
						this.tLeft = iWidth - left;
					}
					if(left+tLeft < bWidth){
						this.tLeft = bWidth-left
					}
					if(top + tTop > iHeight){
						this.tTop = iHeight - top;
					}
					if(top + tTop < bHeight){
						this.tTop = bHeight - top;
					}
					break;
				case 270:
					if(left + tLeft > 0 ){
						this.tLeft =  - left;
					}
					if(left + tLeft + iHeight < bWidth ){
						this.tLeft =  bWidth - left - iHeight;
					}
					if(top + tTop < bHeight){
						this.tTop = bHeight - top;
					}
					if(top + tTop - iWidth > 0 ){
						this.tTop = iWidth- top;
					}
					break;
				default:
					if(left + tLeft + iWidth < bWidth){
						this.tLeft = bWidth - left - iWidth ;
					}
					if(left + tLeft > 0 ){
						this.tLeft = - left;
					}
					if(top + tTop + iHeight < bHeight){
						this.tTop = bHeight - top - iHeight ;
					}
					if(top + tTop > 0 ){
						this.tTop = - top;
					}
					break;
			}
		},
		toucheM(e){
			//当前鼠标位置
			let { clientX, clientY } = e.changedTouches[0];
			//起始鼠标位置
			let { clientX: clientXs, clientY: clientYs } = this.toucheStartValue.changedTouches[0];
			//X轴移动量
			this.tLeft = clientX - clientXs;
			//Y轴移动量
			this.tTop = clientY - clientYs;
		},
		touchmove(e) {
			let time = new Date().getTime();
			let toucheLen = e.touches.length;
			if(toucheLen>1){
				this.toucheScale(e);
				this.correctionLocation();
				return;
			}
			if(toucheLen == 1){
				this.toucheM(e);
				this.correctionLocation();
				return;
			}
		},
		touchend(e) {
			this.correctionLocationFinish();
		}
	},
	mounted() {
		this.mountedStatus = true;
		this.initValue()
	},
	destroyed(){
		this.mountedStatus = false;
	}
};
</script>

<style>
.imgbox {
	width: 80vw;
	height: 80vw;
	top: -10vw;
	left: -10vw;
	z-index: -1;
	position: relative;
	/* background: #007AFF; */
}
.cvbox {
	background-color: rgba(255, 255, 255, 0);
	width: 50vw;
	height: 50vw;
	border: 1px dashed #fff;
}
.bc {
	background-color: rgba(0, 0, 0, 0.5);
	color: rgba(255,255,255,0.3);
	width: 100%;
	height: 100%;
	flex: 1 100 auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
.ctrl {
	width: 10px;
	height: 10px;
	/* background-color: #4CD964; */
	position: fixed;
}
.ab {
	position: absolute;
	/* background-color: #2c405a; */
}
.cs {
	flex: none;
	display: flex;
	flex-flow: row nowrap;
	/* border: 1px solid #4CD964; */
	align-items: center;
}
.ct {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-flow: column nowrap;
}
.cbt {
	position: absolute;
	background-color: #000;
	z-index: -5;
}
</style>
