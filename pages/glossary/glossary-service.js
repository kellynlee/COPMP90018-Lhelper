import {GLOSSARY_URL} from "../../utils/paths.js";
import {getUrl, getArray} from "../../utils/methods.js"
const axios = require("axios");

const getGlossary = async function (usrname) {
	const url = GLOSSARY_URL+"/"+usrname;
	const res = await axios.get(getUrl(url))
	if (res.status === 200 && res.data) {
		const glossaryList = getArray(res.data);
		return glossaryList;
	} else {
		return null;
	}
}

const addGlossary = async function (usrname,wordItem) {
	const url = GLOSSARY_URL+"/"+usrname;
	const res = await axios.post(getUrl(url),wordItem)
	if (res.status === 200) {
		return true;
	} else {
		return false;
	}
}

export {
	getGlossary,addGlossary
}