

import {GLOSSARY_URL} from "../../utils/paths.js";
import {getUrl, getArray,request} from "../../utils/methods.js"
/**
 * Get all glossary
 */
const getGlossary = async function (usrname) {
	const url = GLOSSARY_URL+"/"+usrname;
	let option = {
		url:url
	}
	const res = await request(option)
	console.log(res)
	if (res.statusCode === 200 && res.data) {
		const glossaryList = getArray(res.data);
		return glossaryList;
	} else {
		return null;
	}
}
/**
 * Add single word to glossary
 */
const addGlossary = async function (usrname,wordItem) {
	let url = GLOSSARY_URL+"/"+usrname;
	let option = {
		url:url,
		method:"POST",
		data:wordItem
	}
	const res = await request(option)
	if (res.statusCode === 200) {
		return true;
	} else {
		return false;
	}
}
/**
 * Delete a word from glossary
 */

const deleteGlossary = async function (usrname,itemId) {
	const url = GLOSSARY_URL+"/"+usrname+"/"+itemId;
	let option = {
		url:url,
		method:"DELETE"
	}
	const res = await request(option)
	console.log(res)
	if (res.statusCode === 200) {
		return true
	} else {
		return false;
	}
}

export {
	getGlossary,addGlossary,deleteGlossary
}