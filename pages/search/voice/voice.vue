<template>
	<view>
		<sound-recording></sound-recording>
		<view>
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

<style>

</style>
