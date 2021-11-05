<template>
	<div class="tantan">

		<movable-area>
			<view class="card-footer">
				<u-button @click="scrolldown">Check Detail</u-button>
			</view>
			<view style="text-align: center;">
				<h3>{{size-index}}/{{size}}</h3>
			</view>
			<view class="card-button-group">
				<u-button type="error" class="inside-u-button" plain @click="forget">Forget</u-button>
				<u-button type="success" class="inside-u-button" plain @click="remember">Remember</u-button>
			</view>
			<block v-for="(item, index) in goods" :key="item.id">
				<movable-view disabled :damping="20" :x="item.x" :y="item.y" inertia out-of-bounds direction="all"
					@change="onMovableChange($event, index)">
					<div class="item" :style="{
						  position: 'relative',
						  zIndex: index + 1,
						  transform: `
							scale(${
							  index == goods.length - 1
								? 1
								: 1 - (goods.length - index) / 100
							})
							translateY(${-index * 10}px)`,
						  transition: 'all .3s',
						}">

						<!-- <u-image :src="item.cover" :width="400" :height="400"></u-image> -->
						<view class="flashcard-item" width="100%" height="100%">
							<h1>{{item.word}}</h1>
							<p>test</p>
						</view>
					</div>
				</movable-view>
				<view>
					<p>test</p>
				</view>
			</block>
		</movable-area>
	</div>
</template>

<script>
	export default {
		props: ['wordList'],
		data() {
			return {
				index: 0,
				size: 0,
				word: '',
				goods: [],
				allWordList: [],
				pageNum: 1,
			};
		},

		created() {},
		watch: {
			wordList() {
				for (let word of this.wordList) {
					this.allWordList.push(word)
				}
				this.size = this.wordList.length
				this.getGoodList(3);
				this.word = this.goods[this.goods.length - 1].word
				this.goods[this.goods.length - 1].moveable = false;
			}
		},
		mounted() {
			// this.getGoodList(3);			
		},
		methods: {
			/**
			 * 模拟获取数据
			 */
			moveHandle(){},
			scrolldown() {
				this.$emit('scrolldown')
			},
			getGoodList(pageSize = 1) {
				for (let index = 0; index < pageSize; index++) {
					if (this.allWordList.length <= 0) {
						return
					}
					let word = this.allWordList.shift()
					console.log(word)
					this.goods.unshift({
						id: String(index) + String(this.pageNum),
						...word,
						x: 0,
						y: 0,
						moveable:true,
						old: {
							x: 0,
							y: 0,
						},
					});

					this.pageNum += 1;
				}
			},

			/**
			 * 移动回调
			 */
			onMovableChange(event, index) {
					console.log(this.index,index,this.goods.length)
					let item = this.goods[index];
					let {
						x,
						y,
						source
					} = event.detail; // 赋值当前坐标
					// console.log(x, y, source);

					item.old.x = x;
					item.old.y = y;
					// 移动结束/手指离开屏幕
					if (source == "friction") {
						this.onMovableEnd(index)
					}
				

			},

			/**
			 * 移动结束回调
			 */
			onMovableEnd(index) {
				let item = this.goods[index];
				let {
					x,
					y
				} = item.old; // 获取当前坐标

				if (x >= 20) {
					console.log("right")
					// 超出右边界
					this.removeItem(index, "like");
				} else if (x <= -20) {
					// 超出左边界
					console.log(index)
					this.removeItem(index, "unlike");
				} else {
					// 没有超出边界，回到中心点
					this.resetItem(index);
				}

			},

			/**
			 * 移除卡片
			 */
			removeItem(index, mode = "like") {
				console.log("获取新数据");
				let item = this.goods[index];
				item.x = item.old.x;
				item.y = item.old.y;

				// 滚动到屏幕外
				this.$nextTick(() => {
					item.x = mode == "like" ? 1000 : -1000; // 喜欢向右滚出、不喜欢向左滚出
					item.y = item.old.y <= 0 ? item.old.y - 100 : item.old.y + 100; // y小于0说明向上滑出，加一点向上的偏移值，效果好一些

					setTimeout(() => {
						this.goods.splice(index, 1); // 移除数据（等动画结束）
						this.getGoodList(); // 继续请求新的数s据
						index++;
						if (this.goods.length === 0) {
							this.$emit('setFinished', true)
						}
						this.word = this.goods[this.goods.length - 1].word
						this.$emit('setword', this.word);
						this.index++;
						this.goods[this.goods.length - 1].moveable = false;
					}, 301);
				});
			},
			forget() {
				this.removeItem(this.goods.length - 1, "unlike");
				this.$emit('setForget', this.index);
			},
			remember() {
				this.removeItem(this.goods.length - 1, "like");
				this.$emit('setRemember', this.index);
			},
			/**
			 * 重设卡片
			 */
			resetItem(index) {
				let item = this.goods[index];
				item.x = item.old.x;
				item.y = item.old.y;

				this.$nextTick(() => {
					item.x = 0;
					item.y = 0;
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.tantan {
		height: 100%;
		overflow: hidden;
		// background-color: #c7e5c7;

		movable-area {
			position: relative;
			width: 300vw;
			height: 100%;
			left: calc(-100vw);
			top: calc(0vh);
		}

		movable-view {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin-top: 150rpx;
			margin-left: auto;
			margin-right: auto;
			// margin: auto;
			width: 500rpx;
			height: 500rpx;
		}

		.item {
			border-radius: 30rpx;
			box-shadow: 0 0 10rpx 2rpx rgba($color: black, $alpha: 0.2);
			overflow: hidden;
		}

		uni-page-body {
			height: 100%;
		}

		.page-body {
			height: 100%;
		}

		.flashcard-item {
			width: 500rpx;
			height: 500rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}

		.card-button-group {
			position: absolute;
			margin-top: 700rpx;
			width: 100vw;
			margin-left: 100vw;
			display: flex;
			justify-content: center;

			.inside-u-button {
				width: 200rpx;
			}
		}

		.card-footer {
			position: absolute;
			bottom: 0px;
			text-align: center;
			width: 100%;
		}
	}
</style>
