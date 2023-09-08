const fs = require("fs");
const cheerio = require("cheerio");

const Division = require("./Division");

const greekify = require("../utils/greekify");
const Line = require("./Line");

module.exports = class XMLFile {
    constructor(url, name, type) {
        //Load XML
        this.url = url;
        this.xml = fs.readFileSync(url, { encoding: "utf-8" });
        this.$ = cheerio.load(this.xml, { xmlMode: true });

        this.name = name;
        this.type = type
    }

    getContent = () => {
        
        let content = [];

        switch (this.type) {
            case 1:
                content = this.makeType1Content();
                break;
            case 2:
                content = this.makeType2Content();
                break;
        }

        return content;
    }

    makeType1Content = () => {
        const $ = this.$;
        const content = [];

        let lineCounter = 1;

        $("body").find("note").remove("note");
        $("body").find("pb").remove("pb");

        $("body")
            .find("sp")
            .each((i, elem) => {
                const id = content.length + 1;
                let speaker;
                const line = [];

                elem.children.forEach((child) => {   
                    if (child.type === "tag" && child.children[0]) {
                        switch (child.name) {
                            case "speaker":
                                speaker = child.children[0].data;
                                break;

                            case "l":
                                const divId = content.length + 1;
                                const text = child.children[0].data;

                                line.push(new Line(lineCounter, text, divId));
                                lineCounter++;
                                break;
                        }
                    }
                });

                content.push(new Division(id, speaker, line));
            });
        return content;
    }

    makeType2Content = () => {
        const $ = this.$;
        const content = [];

        $("body")
            .find("div")
            .each((i, elem) => {
                elem.children.forEach((child) => {
                    if (child.name === "said" && child.children[0]) {
                        const id = content.length + 1;
                        const speaker = child.attribs.who.substring(1);
                        const line = []

                        child.children.forEach(grandchild => {
                            if (grandchild.attribs && grandchild.children[0]) {
                                line.push(new Line(grandchild.attribs.n, grandchild.children[0].data, id))
                            }
                        })

                        content.push(new Division(id, speaker, line));
                    }
                });
            });

        return content;
    }
}
