import {GLOSSARY_URL} from "../../utils/paths.js";
import {getUrl, getArray} from "../../utils/methods.js"
const axios = require("axios");

const getGlossary = async function (usrname) {
	const url = GLOSSARY_URL+"/"+usrname;
	const res = await axios.get(getUrl(url))
	if (res.status === 200) {
		const glossaryList = getArray(res.data);
		return glossaryList;
	} else {
		return null;
	}
}
export {
	getGlossary
}