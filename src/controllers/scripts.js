import dayjs from "dayjs";

function fillArrayUpToLimit(data, limit = undefined) {
	if (limit !== undefined) {
		const output = [];
		const exitValue = data.length > limit ? limit : data.length;
		let i = 0;
		while (output.length < exitValue) {
			output.push(data[i]);
			i++;
		}
		return output;
	}
	const output = data.map(message => message);
	return output;
}

function addTimeStamp(content) {
	const timeStamp = dayjs().format('HH:mm:ss')
	const output = {...content, time: timeStamp}
	return output;
}

const scripts = {
	fillArrayUpToLimit,
	addTimeStamp
};

export default scripts;