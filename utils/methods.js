/**
 * Get formatted url
 */
const getUrl = function (url) {
  return url + ".json";
};

/**
 * Convert object to array
 */
const getArray = function (obj) {
  let array = [];
  Object.keys(obj).forEach(function (key) {
    let elem = {
      ...obj[key],
      id: key,
    };
    array.push(elem);
  });
  return array;
};
/**
 * Create daily flashcard
 */
import { FLASHCARD_URL } from "./paths.js";
const createFlashCard = async function (username, date, wordList) {
  let url = FLASHCARD_URL + "/" + username + "/" + date;
  // const url = getUrl(FLASHCARD_URL+"/"+date);
  let data = {
    created_date: date,
    word_count: wordList.length,
    word_list: wordList,
  };
  let option = {
    url: url,
    method: "POST",
    data: data,
  };
  let res = await request(option);
  return res;
};
const checkUpdate = async function (username, date) {
  let url = FLASHCARD_URL + "/" + username + "/" + date;
  let option = {
    url: url,
  };
  let res = await request(option);
  if (res.statusCode === 200 && res.data) {
    return true;
  } else {
    return false;
  }
};

/**
 * Encapsulate the function for request
 */
const request = (options, dic) => {
  return new Promise((resolve, reject) => {
    let url;
    if (!dic) {
      url = getUrl(options.url);
    } else {
      url = options.url;
    }
    uni.request({
      url: url,
      method: options.method || "GET",
      header: { "content-type": "application/json" },
      data: options.data || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
export { getUrl, getArray, createFlashCard, checkUpdate, request };
