module.exports = class Line {
    constructor(id, text, divId) {
        this.id = id;
        this.text = text || "";
        this.divId = divId;
        //this.cleanText = this.getCleanText();
        this.length = this.getLength();
    }

    getLength() {
        if (this.text) return this.getCleanText(this.text).split(" ").length;
        else return 0;
    }

    getCleanText() {
        let cleanText = this.text;
        const purgeChar = [",", ".", ";", ":", "—", "†"];

        for (let char of purgeChar) {
            cleanText = cleanText ? cleanText.split(char).join("") : null;
        }

        return cleanText;
    }
}
