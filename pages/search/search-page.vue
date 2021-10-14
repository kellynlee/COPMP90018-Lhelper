<template>
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
