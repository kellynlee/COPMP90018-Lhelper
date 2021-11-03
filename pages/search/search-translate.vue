<!--
Use Merriam-Webster dictionary API and Google translate API 
to get the meaning of the words and display them in the search result page.
-->
<template>
	
	<div id="vue_det">
		<input id="input" v-model="message" placeholder="Enter a word"/>
		<button id="go" @click="translate()">GO</button>
		<h1>{{message}}</h1>
		<button id="audio" @click="audio()">{{kk}}</button>			
		<h4>{{trans_word}}</h4>
		<view v-for="(item, index) in detail" :key="index">
			<p>{{item.pos}}</p>
			<h4>{{item.meaning}}</h4>
			<view v-for="(item, index) in item.eg" :key="index">
				<p>{{item.exps}}</p>
				<p>{{item.trans}}</p>
			</view>			
		</view>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
				message:"",
				audio_name:"",
				trans_word: "",
				kk:"", 
				detail: [
					{pos:"adj.", meaning:"meaning", eg:[{exps:"exps" , trans:"trans"}]}
				], 
								
				
			}
		},
		methods:{
			
			// get audio from merriam-webster and play
			audio(){
				const iac = uni.createInnerAudioContext();
				var sound_url = 'https://media.merriam-webster.com/audio/prons/en/us/mp3/'+this.audio_name.charAt(0)+'/'+this.audio_name+'.mp3'
				alert(sound_url);
				iac.src = sound_url;
				iac.play(() =>{
					console.log('play~');
				});
			},
			
			// find the word meaning in merriam-webster dictionary 
			// then translate to the language as user demand 
			// (only supply Chinese so far)
			translate(){ 
				
				uni.request({
					url:'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'+this.message+'?key=866972fb-209a-4a87-9ab9-39b2863b6832',
					
					success:(res) => {
						
						// search in merriam-webster JSON file
						function find_ex(obj, k){
							
							for(var key in obj){								
								var val = obj[key];
								if (key==k && Array.isArray(val)){
									return val;		
								}						
								//if (typeof(val)===Object && !Array.isArray(val)){
									//var a = find_ex(val, k);
									//if (a != null) return a;
								//}						
								if (Array.isArray(val)) {
									for (var i=0; i<val.length; i++){
										var b = find_ex(val[i], k);
										if (b != null) { 
											return b;
										}	
									}
								}								
							}
							return null;							
						}
						
						
						var poss = []
						console.log(res.data);
						this.kk = '/'+ res.data[0].hwi.prs[0]['mw'] +'/';
						this.audio_name = res.data[0].hwi.prs[0].sound['audio'];
						var len = Math.min(res.data.length, 3);
						
						
						// for different part of speech
						for(var i=0; i<len; i++){
							
							var pos1 = res.data[i]['fl'];			
							var meaning1 = res.data[i].shortdef[0];									
							var obj = res.data[i].def[0].sseq[0];
							var dt = find_ex(obj, 'dt');	
							var egs = [];
							var transs =[];
							var ex = "";
							var trans_ex1 = "";
							
							// find examples and translate them
							if (dt.length > 1){
								if (dt[1].length >1){
									var len_dt = dt[1][1].length;
									for(var j=0; j<len_dt; j++){				
										ex = dt[1][1][j]['t'];
										ex = ex.replace(/\{wi\}/g,'');
										ex = ex.replace(/\{\/wi\}/g,'');
										ex = ex.replace(/\{it\}/g,'');
										ex = ex.replace(/\{\/it\}/g,'');
										alert('EX'+ex);
										
										
										egs.push(ex);
									}
									
									alert('EGS'+egs);
									setTimeout(()=>{},100);
									
									uni.request({
										url:"https://translation.googleapis.com/language/translate/v2?key=AIzaSyCB517fv6zesTMgtXx9mPjgeVccBuncSsE",
										data:{
											
											q:egs,
											source:"en",
											target:"zh",
									
										},
										method:"POST",
										success:(res) => {
											console.log(res.data);
											var trans_len = res.data.data.translations.length;
											for (var d=0; d<trans_len; d++){
												transs.push(res.data.data.translations[d]['translatedText']);
											}
											
											
										},
									});
								}
							}
						
							
							var et = [];
							// change format for display
							for (var c=0; c<egs.length; c++){
								alert(egs[c], transs[c]);
								et.push({exps:egs[c], trans:transs[c]});
							}
							poss.push({pos:pos1, meaning:meaning1, eg:et});
						}	
						this.detail = poss;
					}
				});
				
				// get the meaning of the word from google API
				uni.request({
					url:"https://translation.googleapis.com/language/translate/v2?key=AIzaSyCB517fv6zesTMgtXx9mPjgeVccBuncSsE",
					data:{
						q:this.message,
						source:"en",
						target:"zh",
				
					},
					method:"POST",
					success:(res2) => {
						console.log(res2.data);
						var zh = res2.data.data.translations[0]['translatedText'];
						alert(zh);
						this.trans_word = zh;
						
					},
				});
				
				
			}
		}
		
		
	};
   
</script>

<style>
</style>
</html>
