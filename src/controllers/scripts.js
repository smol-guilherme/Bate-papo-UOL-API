
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
                output.push(messages[i]);
                i++;
            }
        }
        return output;
    }
    const output = messages.filter((msg) => msg.to === user || msg.to === "Todos");
    return output;
}

const scripts = {
    participants,
    fillArrayUpToLimit
};

export default scripts;