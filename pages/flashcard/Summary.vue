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
				<u-icon :name="item.flag? 'checkmark':'close'" color="#aabb97"></u-icon>
			</u-col>
		</u-row>
		<view class="btn">
			<button class="confirm-btn uni-button">OK</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				summaryList:[],
				percentage:""
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
            },
            {
                "id": "-MnUzba4ZWuu8RvKvdkZ",
                "phonetic_symbol": "",
                "word": "abbreviated",
								"flag":true
            },
            {
                "id": "-MnUzcvu2RtU_7LztrRa",
                "phonetic_symbol": "",
                "word": "aberuncator",
								"flag":true
            },
            {
                "id": "-MnUzg-sIgKKz4Mwp88V",
                "phonetic_symbol": "",
                "word": "osiered",
								"flag":false
            },
            {
                "id": "-MnUzhPfw4QQnpFg_qH7",
                "phonetic_symbol": "",
                "word": "osmiamate",
								"flag":false
            },
            {
                "id": "-MnUziwJBzjOdDD4g4LR",
                "phonetic_symbol": "",
                "word": "osspringer",
								"flag":false
            },
            {
                "id": "-MnUzktOLq2vKD6mX6W4",
                "phonetic_symbol": "",
                "word": "submissly",
								"flag":false
            }
        ]
				this.summaryList = Object.assign([],dummyData)
				this.getCorrect()
		},
		methods: {
			getCorrect() {
				let correct = 0
				this.summaryList.forEach(elem => {
					if (elem.flag) {
						correct++
					}
				});
				this.percentage = Math.round((correct / this.summaryList.length)*100)
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
