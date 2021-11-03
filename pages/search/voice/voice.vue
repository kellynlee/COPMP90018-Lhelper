<template>
	<view class="voice-page">
		<sound-recording></sound-recording>
		<view class="search-area">
				<u-field
					v-model="word"
					label="Word:"
				>
				</u-field>
			</view>
		<!-- <view>{{a}}</view> -->
		<u-button  @click="searchIndex">submit</u-button>
		<view>{{wordLst}}</view>
	</view>
	
	
</template>

<script>
	import soundRecording from '@/components/sound-recording/sound-recording.vue';
	let word_json = require('@/pages/search/words.json');
	export default {
		components: {soundRecording},
		data() {
			return {
				a:word_json,
				word:"",
				wordLst:["abc"],
			}
		},
		methods: {
			searchIndex(){
				this.wordLst=[]
				var len = word_json.words.length;
				var firstP = false;
				for (var i = 0; i < len; i++) { 
				    var testWord = word_json.words[i]
					if (testWord.indexOf(this.word) == 0){
						this.wordLst.push(testWord);
					}else{
						if (firstP){
							break;
						}
					}
					
				 }
			}
		}
	}
</script>

<style lang="scss" scoped>
.voice-page {
	margin: 1rem;
	background-color: white;
	border-radius: 1rem;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
	  rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
	.selection-area {
		
	}
}
</style>
