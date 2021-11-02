/**
 * Get formatted url
 */
const getUrl = function(url){
	return url+".json"
}

/**
 * Convert object to array
 */
const getArray = function(obj){
	let array = []
	Object.keys(obj).forEach(function(key){
		let elem = {
			...obj[key],
			id: key
			}
			array.push(elem)
	});
	return array;
}
/**
 * Create daily flashcard
 */
import {FLASHCARD_URL} from "./paths.js"
const axios = require("axios");
const createFlashCard = async function(username,date,wordList) {
	 const url = getUrl(FLASHCARD_URL+"/"+username+"/"+date)
	 // const url = getUrl(FLASHCARD_URL+"/"+date);
	 const data = {
		 "created_date":date,
		 "word_count":wordList.length,
		 "word_list":wordList
	 }
	 const res = await axios.post(url,data)
	 return res;
 }
 const checkUpdate = async function(username,date) {
 	let url = FLASHCARD_URL+"/"+username+"/"+date
 	let res = await axios.get(getUrl(url))
 	if (res.status === 200 && res.data) {
 		return true;
 	} else {
 		return false;
 	}
 }

export {
	getUrl, getArray, createFlashCard, checkUpdate
}
