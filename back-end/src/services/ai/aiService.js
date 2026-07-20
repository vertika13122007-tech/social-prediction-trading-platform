const ai = require("../../../db/gemini");

async function askAI(prompt){
    const response = await ai.models.generateContent({
        model:"gemini-3.5-flash",
        contents: prompt,
    });
    return response.text;
}

module.exports = {
    askAI
};