<template>
	<view class="u-demo">
		<u-card :title="data.words_list[number].word" title-size="60" margin="300rpx 180rpx 0rpx 180rpx">
			<view class="" slot="body">
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">{{data.words_list[number].phonetic_symbol}}</view>	
				</view>
			</view>
		</u-card>
		<u-button @click="former()" class="custom-former" size="default">{{text1}}</u-button>
		<u-button @click="next()" class="custom-next" size="default">{{text2}}</u-button>
		<u-button style="forStyle" @click="forget()" class="custom-forget" size="default">{{text4}}</u-button>
		<u-button style="remStyle" @click="remember()" class="custom-remember" size="default">{{text3}}</u-button>
		<u-button class="custom-count" size="default">{{text0}}</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				number: 0,
				x: "primary",
				rem_list: new Array(),
				text1: "<",
				text2: ">",
				text3: "remember",
				text4: "forget",
				data: {
    created_date: "1/20/2021",
    word_count: 5,
    words_list: [
      {
        id: "hfudy738",
        phonetic_symbol: "/ˈfɔːmə/",
        word: "Former1"
      },
      {
        id: "hfudy738",
        phonetic_symbol: "/ˈfɔːmə/",
        word: "Former2"
      },
      {
        id: "hfudy738",
        phonetic_symbol: "/ˈfɔːmə/",
        word: "Former3"
      },
      {
        id: "hfudy738",
        phonetic_symbol: "/ˈfɔːmə/",
        word: "Former4"
      },
      {
        id: "hfudy738",
        phonetic_symbol: "/ˈfɔːmə/",
        word: "Former5"
      }
    ]
  }

			}
		},
		computed: {
		    text0: function () {
				return (this.number+1)+"/"+this.data.word_count
		    },
			forStyle() {
				if (this.rem_list[this.number]==1)
				{
					return {
						type:"primary"
					};
				}
				else
				{
					return{
						type:"default"
					};
				}
			},
			remStyle() {
				if (this.rem_list[this.number]==2)
				{
					return {
						type:"primary"
					};
				}
				else
				{
					return{
						type:"default"
					};
				}
			}
		},
		onLoad() {
				 //this.loadwordlist();
		   },
		methods:{
			loadwordlist () {
				var getListUrl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/DailyWords.json'
				uni.request({
					url: getListUrl,
					method: "GET", 
					header: { 'content-type': 'application/json' },
					data:{},
					success: (res) => {
						this.data =res.data;
						console.log(this.data);
					}
				});
			},
			former() {
				if (this.number==0)
				{this.number=this.data.word_count-1;}
				else {this.number--;}
			},
			next() {
				if (this.number==(this.data.word_count-1))
				{this.number=0;}
				else {this.number++;}
			},
			forget() {
				this.rem_list[this.number]=1;
				var flag=true;
				for (var i=0; i<this.data.word_count;i++)
				{
					if ((this.rem_list[i]!=1)&&(this.rem_list[i]!=2))
					{
						flag=false;
						break;
					}
				}
				if (flag)
				{
					this.$u.route({	url: "/pages/flashcard/report"})
				}
			},
			remember() {
				this.rem_list[this.number]=2;
				var flag=true;
				for (var i=0; i<this.data.word_count;i++)
				{
					if ((this.rem_list[i]!=1)&&(this.rem_list[i]!=2))
					{
						flag=false;
						break;
					}
				}
				if (flag)
				{
					this.$u.route({	url: "/pages/flashcard/report"})
				}
			}
		},
	};
</script>

<style scoped>
	.custom-count {
		margin-top: -650rpx;
		width: 100rpx;
		height: 50rpx;
		margin-right: 330rpx;
	}
</style>

<style scoped>
	.custom-former {
		margin-top: -150rpx;
		width: 80rpx;
		height: 80rpx;
		margin-right: 620rpx;
	}
</style>

<style scoped>
	.custom-next {
		margin-top: -80rpx;
		width: 80rpx;
		height: 80rpx;
		margin-right: 50rpx;
	}
</style>

<style scoped>
	.custom-forget {
		margin-top: 300rpx;
		width: 300rpx;
		height: 80rpx;
		margin-right: 50rpx;
	}
</style>

<style scoped>
	.custom-remember {
		margin-top: -80rpx;
		width: 300rpx;
		height: 80rpx;
		margin-right: 400rpx;
	}
</style>
