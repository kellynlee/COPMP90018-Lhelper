<template>
	<view class="glossary-page">
		<!-- <u-navbar :is-back="false" title="Glossary" :background="styles.navBackground" class="nav-bar" title-color="#000000"/> -->
		<view class="list">
			<transition-group name="delete">
				<view class="item-card" v-for="(item, index) in glossaryList"
				:key="item.id">
						<view class="item-content" 
						:id="index" 
						@touchstart="drawStart" 
						@touchmove="drawMove" 
						@touchend="drawEnd" 
						:style="'right:'+item.right+'px'">
							<u-row>
								<u-col span="11"><p class="item-title">{{item.word}}</p></u-col>
								<u-col span="1">
									<u-icon v-if="item.star" name="heart-fill" color="#f06292"></u-icon>
								</u-col>
							</u-row>
							<p>{{"ADD TIME:"+item.added_time}}</p>
							<p>{{"HITS:"+getHits(item)}}</p>
							<u-row gutter="2" class="collapse-card" justify="space-around">
								<u-col span="4">
									<button class="button uni-button" @click="onClickStar(item,index)">
										<u-icon name="heart" custom-prefix="custom-icon" class="icon-btn"></u-icon>
										{{item.star? "Unstar":"Star"}}
										</button>
								</u-col>
								<u-col span="4">
									<button class="button uni-button">
										<u-icon name="pencil" custom-prefix="custom-icon" class="icon-btn"></u-icon>Review
									</button>
								</u-col>
							</u-row>
						</view>
					<view class="delete-item">
						<button class="delete-btn uni-button" @click="onDelete(item,index)">
							<u-icon name="close"></u-icon>
							</button>
					</view>
				</view>
			</transition-group>
			
		</view>
	</view>
</template>

<script>
	import {GLOSSARY_URL} from "../../utils/paths.js";
	import {getUrl, getArray} from "../../utils/methods.js"
	const axios = require("axios");
	export default{
		mounted() {
			axios.get(getUrl(GLOSSARY_URL)).then((res) => {
				let obj = res.data
				this.glossaryList = getArray(obj)
			})
		},
		data() {
			return {
				glossaryList:[],
				styles:{
					navBackground:{
						backgroundColor:"#c7e5c8",
					},
				},
				isLongPressed:false,
				selectedIndex:[],
				delBtnWidth:60,
				startX:""
			}
		},
		methods:{
			getHits(item) {
				return item.hit+"/"+(item.hit+item.forget)
			},
			onClickStar(item,index) {
				let changeFiled = {
					star:undefined
				};
				let patchUrl = getUrl(GLOSSARY_URL+"/"+item.id);
				if(item.star) {
					changeFiled.star = false
				} else {
					changeFiled.star = true
				}
				axios.patch(patchUrl,changeFiled).then((res) => {
					if (res.status == 200) {
						this.$set(this.glossaryList[index],"star",res.data.star)
					}
				})
			},
			onPressItem(item,index) {
				if(!this.isLongPressed) {
					this.isLongPressed = true;
					this.selectedIndex.push(index);
				}
			},
			onSelect(index) {
				if (!this.selectedIndex.find(elem => elem === index)) {
					this.selectedIndex.push(index);
				} else {
					this.selectedIndex = this.selectedIndex.slice(index,index+1);
				}
			},
			
			itemSelectedClass(index) {
				// if(this.isLongPressed) {
					if (this.selectedIndex.find(elem => elem === index) !== undefined) {
						return "item-selected"
					}
				// }
			},
			onDelete(item,index){
				let deleteIndex = GLOSSARY_URL+item.id;
				axios.delete(getUrl(deleteIndex)).then((res) => {
					if(res.status === 200) {
							this.glossaryList.splice(index,1)
					}
				})
			},
			
			drawStart(e) {
				console.log("开始触发");
				let touch = e.touches[0];
				this.startX = touch.clientX;
			},

			drawMove(e) {
			    
				console.log("滑动");
				for (let index in this.glossaryList) {
					this.$set(this.glossaryList[index],'right',0);
				}
				let touch = e.touches[0];
				let item = this.glossaryList[parseInt(e.currentTarget.id)];
				let disX = this.startX - touch.clientX;
				if (disX >= 20) {
			    
					if (disX > this.delBtnWidth) {
			    
						disX = this.delBtnWidth;
					}
				this.$set(this.glossaryList[parseInt(e.currentTarget.id)],'right',disX);
				} else {
			    
					this.$set(this.glossaryList[parseInt(e.currentTarget.id)],'right',0);
				}
			},
			
			drawEnd(e) {
			    
				console.log("滑动结束");
				let item = this.glossaryList[parseInt(e.currentTarget.id)];
				if (item.right >= this.delBtnWidth / 2) {
			    
					this.$set(this.glossaryList[parseInt(e.currentTarget.id)],'right',this.delBtnWidth);
				} else {
			    
					this.$set(this.glossaryList[parseInt(e.currentTarget.id)],'right',0);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.glossary-page{
		position: absolute;
		height: 100vh;
		width: 100vw;
		.nav-bar{
			top: 0;
			width: 100%;
			height: 44px;
		}
		.list {
			overflow: scroll;
			width: 100%;
			height: calc(100% - 94px);
			.item-card {
				position: relative;
				.item-content {
					margin: 0.5rem 1rem;
					box-shadow:rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
					border-radius:10px;
					background:#ffffff;
					padding: 0.5rem 1rem;
					position: relative;
					z-index: 100;
					.item-title {
						line-height: 2.25rem;
						font-size: 1rem;
						font-weight: bold;
					}
					.button {
							background-color: #90caf9;
							font-size: 0.5rem;
							color: #ffffff;
							// margin-bottom: 1rem;
							margin-top: 0.8rem;
							border-radius:10px;
							.icon-btn {
								margin-right: 0.2rem;
							}
						}
						.uni-button:after {
							border: none;
						}
					}
				}
				.delete-item {
					position: absolute;
					right: 0;
					top: 0;
					height: 100%;
					display: flex;
					align-items: center;
					padding-right: 1.25rem;
					z-index: 5;
					.delete-btn {
						height: fit-content;
						border-radius: 2rem;
						background: #90caf9;
						box-shadow:rgba(0, 0, 0, 0.16) 0px 1px 4px;
					}
					.uni-button:after {
						border: none;
					}
				}
		}
		
	}
	.search-bar{
		width: 100%;
		background-color: #c7e5c8;
	}
	
	.delete-leave {
		opacity: 1;
	}
	.delete-leave-to {
		opacity: 0;
	}
  .delete-leave-active {
		transition: opacity .5s;
	}

</style>
