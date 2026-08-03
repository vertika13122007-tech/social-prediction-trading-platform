const ai = require("../../../db/gemini");

async function askAI(prompt){
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });
    
    let rawText = response.text || "";
    // Clean unwanted markdown symbols
    let cleanedText = rawText
        .replace(/\*\*/g, "")
        .replace(/\*/g, "•")
        .replace(/#{1,6}\s*/g, "")
        .replace(/`{1,3}/g, "")
        .replace(/_{1,2}/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return cleanedText;
}

module.exports = {
    askAI
};