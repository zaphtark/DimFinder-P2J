module.exports = class Text {
  constructor(XMLFile) {
    this.title = XMLFile.name;
    this.content = XMLFile.getContent();
    this.length = this.getLength();
  }

  getLength() {
    let length = 0;
    for (let division of this.content) {
      length += division.getLength();
    }
    return length;
  }
};


