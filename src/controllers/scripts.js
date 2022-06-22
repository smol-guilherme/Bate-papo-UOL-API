
const messages = [{
	to: "Maria",
	text: "oi sumida rs",
	type: "private_message"
}];

function fillArrayUpToLimit(limit, user) {
	if (limit !== undefined) {
		const output = [];
		const exitValue = messages.length > limit ? limit : messages.length;
		let i = 0;
		while (i !== exitValue) {
			if (messages[i].to === user) {
				output.push(messages[i]);
				i++;
			}
		}
		return output;
	}
	const output = messages.filter((msg) => msg.to === user || msg.to === "Todos");
	return output;
}

function isEmpty(item) {
	if (item.length === 0) {
		return true;
	}
	return false;
}

function isInvalidField(item) {
	if (item === "message" || item === "private_messge") {
		return true;
	}
	return false;
}

// function validMessageFormat(content, header) {
// 	const { to, text, type } = content;
// 	const { from } = header;
// 	if (isEmpty(to) || isEmpty(text)) {
// 		return false;
// 	}
// 	if (isInvalidField(type)) {
// 		return false;
// 	}
// 	return true;
// }

const scripts = {
	fillArrayUpToLimit,
};

export default scripts;