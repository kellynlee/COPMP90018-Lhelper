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

export {
	getUrl, getArray
}
