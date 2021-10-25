<template>
	<p>this is glossary page</p>
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
				glossaryList:[]
			}
		},
		methods:{}
	}
</script>

<style>
</style>
