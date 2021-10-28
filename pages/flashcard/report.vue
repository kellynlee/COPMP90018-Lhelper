<template>
	<view class="u-demo">
		<u-card :title="reporttitle" title-size="25" full="true">
			<view class="" slot="body">
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">
						{{line1}}
					</view>	
				</view>
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">
						{{line2}}
					</view>	
				</view>
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">
						{{line3}}
					</view>	
				</view>
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">
						{{line4}}
					</view>	
				</view>
				<view class="u-body-item u-flex u-row-between u-p-b-0">
					<view class="u-body-item-title u-line-2">
						{{line5}}
					</view>	
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {
				  created_date: "1/20/2021",
				  word_count: 5,
				  words_list: [
				    {
				      id: "hfudy738",
				      phonetic_symbol: "/ˈfɔːmə/",
				      word: "Former1",
					  forget: "0",
				    },
				    {
				      id: "hfudy738",
				      phonetic_symbol: "/ˈfɔːmə/",
				      word: "Former2",
					  forget: "0"
				    },
				    {
				      id: "hfudy738",
				      phonetic_symbol: "/ˈfɔːmə/",
				      word: "Former3",
					  forget: "0"
				    },
				    {
				      id: "hfudy738",
				      phonetic_symbol: "/ˈfɔːmə/",
				      word: "Former4",
					  forget: "1"
				    },
				    {
				      id: "hfudy738",
				      phonetic_symbol: "/ˈfɔːmə/",
				      word: "Former5",
					  forget: "1"
				    }
				  ]
				}
			}
		},
		computed: {
			reporttitle: function () {
				return "You’ve got "+this.correctnum+"/"+this.totalnum+" correct words!"
			},
			totalnum: function () {
				return this.data.word_count
			},
			correctnum: function () {
				var n=0;
				for (var i=0; i<this.data.word_count;i++)
				{
					if (this.data.words_list[i].forget==0)
					{
						n++;
					}
				}
				return n
			},
			line1: function () {
				if (this.data.words_list[0].forget==0)
				{
					return this.data.words_list[0].word+"√"
				}
				else
				{
					return this.data.words_list[0].word+"×"
				}
			},
			line2: function () {
				if (this.data.words_list[1].forget==0)
				{
					return this.data.words_list[1].word+"√"
				}
				else
				{
					return this.data.words_list[1].word+"×"
				}
			},
			line3: function () {
				if (this.data.words_list[2].forget==0)
				{
					return this.data.words_list[2].word+"√"
				}
				else
				{
					return this.data.words_list[2].word+"×"
				}
			},
			line4: function () {
				if (this.data.words_list[3].forget==0)
				{
					return this.data.words_list[3].word+"√"
				}
				else
				{
					return this.data.words_list[3].word+"×"
				}
			},
			line5: function () {
				if (this.data.words_list[4].forget==0)
				{
					return this.data.words_list[4].word+"√"
				}
				else
				{
					return this.data.words_list[4].word+"×"
				}
			},
		},
		methods:{
		},
	}
</script>

<style lang="scss" scoped>
	.u-demo {}
</style>
