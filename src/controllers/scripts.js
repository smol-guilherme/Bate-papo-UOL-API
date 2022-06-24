import { stripHtml } from "string-strip-html";
import dayjs from "dayjs";

const A_MILLISECOND = 1000;

function addTimeStamp(content) {
	const timeStamp = dayjs().format('HH:mm:ss');
	const output = {...content, time: timeStamp};
	return output;
}

function timeNowMinusTen() {
    return (Date.now() - 10*A_MILLISECOND);
}

function sanitizeData(data) {
	const output = { ...data };
	for(let param in data) {
		output[param] = (stripHtml(data[param]).result).trim();
	}
	return output;
}

const scripts = {
	timeNowMinusTen,
	addTimeStamp,
	sanitizeData
};

export default scripts;