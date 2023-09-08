const perseus2JSON = require("./src/perseus2JSON");
const playsJSON = require("./urls.json");

const myArgs = process.argv.slice(2);

const nameIdx = myArgs.indexOf("--name")
const allFlagIdx = myArgs.indexOf("-a")

const name = nameIdx >= 0 ? myArgs[nameIdx + 1] : null;

if ((nameIdx >= 0 && allFlagIdx >= 0) || (nameIdx >= 0 && !name) || (nameIdx >= 0 && name == "-a") || (nameIdx < 0 && allFlagIdx < 0)) {
    /*console.log(nameIdx >= 0 && allFlagIdx >= 0)
    console.log(nameIdx >= 0 && !name)
    console.log(nameIdx >= 0 && name == "-a")
    console.log(nameIdx <= 0 && allFlagIdx <= 0)*/
    throw "Please provide argument --name 'title' OR use flag -a for all plays"
}

else if (allFlagIdx >= 0) {
    for (let play of playsJSON.plays) {
        perseus2JSON(play);
    }
}

else {
    let found = false;

    for (let play of playsJSON.plays) {
        if (play.title == name) {
            found = true;
            perseus2JSON(play);
        }
    }

    if (!found) {
        throw "A text with this name was not found"
    }

}
