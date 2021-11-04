<template>
	<view class="summary-page">
		<view class="summary-chart">
			<u-circle-progress 
			active-color="#c7e5c8" 
			:percent="this.percentage" 
			:round="false"
			bg-color="transparent"
			duration="2000">
				<text class='summary-progress'>{{this.percentage+"%"}}</text>
			</u-circle-progress>
		</view>
		<view class="summary-subtitle">
			<text class=''>{{"Congrats! You've got "+this.percentage+"% correct rate"}}</text>
		</view>
		<u-row class="summary-item" v-for="(item,index) in summaryList" :key="index">
			<u-col class="" span="10">
				{{item.word}}
			</u-col>
			<u-col class="" span="1" >
				<u-icon 
				:name="item.remember? 'checkmark':'close'" 
				:color="item.remember?'#aabb97':'#f06292'"></u-icon>
			</u-col>
		</u-row>
		<view class="btn" @click="jumpBack">
			<button class="confirm-btn uni-button">OK</button>
		</view>
		
	</view>
</template>

<script>
	import {UpdateTodo} from "../todolist/db.js"
	import {getUrl} from"../../utils/methods.js"
	import {TODO_URL} from "../../utils/paths.js"
	import dateFormat from "dateformat";
	const axios = require("axios");
	export default {
		data() {
			return {
				summaryList:[],
				percentage:"",
				user:"",
				
			}
		},
		created() {
			// this.summaryList = Object.assign([],this.$store.state)
			const dummyData = [
            {
                "id": "-MnUzVdqoQMaljunwhAi",
                "phonetic_symbol": "",
                "word": "waive",
								"flag":true
            }
        ]
				this.summaryList = Object.assign([],this.$store.state.flash_words)
				this.$u.vuex('flash_words', []);
				this.user = this.$store.state.vuex_user.id;
				this.getCorrect()
		},
		methods: {
			getCorrect() {
				let correct = 0
				this.summaryList.forEach(elem => {
					if (elem.remember) {
						correct++
					}
				});
				this.percentage = Math.round((correct / this.summaryList.length)*100)
			},
			async jumpBack(){
				let now = new Date().getTime();
				let today = dateFormat(now, "yyyy-mm-dd");
				try{
					let url = getUrl(TODO_URL+"/"+this.user+'/'+today);
					let res = await axios.get(url);
					if (res.status == 200 && res.data){
						let todo = res.data;
						let index = todo.findIndex(elem => elem.type == "flashcard");
						if(index != -1) {
							todo[index].done = true;
							let update = await axios.put(url,todo)
						}
					}
				}catch(e){
					//TODO handle the exception
				}
				uni.navigateBack()
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.summary-page {
	margin: 0.8rem;
	overflow: scroll;
	background-color: white;
	border-radius: 1rem;
	box-shadow:rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
	.summary-chart {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
		.summary-progress {
			font-weight: bold;
		}
	}
	.summary-subtitle {
		margin-left: 1rem;
	}
	.summary-item {
		margin: 1rem ;
		// padding: 0 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.btn {
		display: flex;
		margin-bottom: 1rem;
		.confirm-btn {
			background-color:#90caf9 ;
			border-radius: 2rem;
			font-size: 1rem;
			color: white;
			box-shadow:rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
		}
		.uni-button:after {
				border: none;
			}
	}
}
</style>
