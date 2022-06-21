
const participants = [];
const messages = [{
    to: "Maria",
    text: "oi sumida rs",
    type: "private_message"
}];

function fillArrayUpToLimit(limit, user) {
    if(limit !== undefined) {
        const output = [];
        const exitValue = messages.length > limit ? limit : messages.length;
        let i = 0;
        while(i !== exitValue) {
            if(messages[i].to === user) {
                output.push(messages[i])
                i++;
            }
        }
        return output;
    }
    const output = messages.filter((msg) => msg.to === user);
    return output;
}

const scripts = {
    fillArrayUpToLimit
};

export default scripts;