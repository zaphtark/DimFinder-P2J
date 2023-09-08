const fs = require("fs");
const path = require('path');
const https = require("https");

const XMLFile = require("./class/XMLFile");
const Text = require("./class/Text")

const perseus2JSON = play =>{

    const url = play.url
    const name = play.title
    const fileUrl = path.join(__dirname, `./data/xml/${name}.xml`);
    const id = 1;

    https.get(url, (res) => {
        const filePath = fs.createWriteStream(fileUrl, { flags: 'a+' });
        res.pipe(filePath);
        filePath.on('finish', () => {
            filePath.close();
            console.log("\n")
            console.log(`**Download Completed from: ${url}**`);
            const file = new XMLFile(fileUrl, name, play.type)
            const text = new Text(file);
    
            const json = JSON.stringify(text);
            const jsonURL = path.join(__dirname, `./data/json/${name}.json`);
    
            fs.writeFile(jsonURL, json, (err) => {
                if (!err) {
                    console.log("\n")
                    console.log(`Perseus2JSON completed for: ${fileUrl}`);
                    console.log(`Result can be found at: ${jsonURL}`)
                }
                else throw err
            });
    
        })
    })
    
}

module.exports = perseus2JSON;