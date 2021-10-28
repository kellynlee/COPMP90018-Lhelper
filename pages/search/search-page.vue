<template>
	<view>
		<u-button @click="openPage(0)">image</u-button>
		<u-button @click="openPage(1)">voice</u-button>
	</view>
</template>

<script>
	export default{
		methods:{
			openPage(b) {
				if (b==0){
					this.$u.route({
					 url: "/pages/search/image/image"
					})
				}else{
					this.$u.route({
					 url: "/pages/search/voice/voice"
					})
				}
				
			   }
		   },
	}
</script>


<!-- <template>
	<h1>{{word}}</h1>
	<input type="button" value="🗣US" /><input type="button" value="🗣UK" />
        <p>{{pos}}</p>
        <h4>{{meaning}}</h4>
	<p>{{examples}}</p>
</template>

<script type="text/javascript">

    var data = { word: "formar",kk:"/FcMeR/", pos: "adj.", meaning: "以前的", examples:"・his former wife..."}
    var vm = new Vue({
        el: '#vue_det',
        data: data
    })
   
</script>

<style>
</style>
 -->