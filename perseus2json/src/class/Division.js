module.exports = class Division {
  constructor(id, name, text) {
    this.id = id;
    this.name = name;
    this.text = text; //Array of Line objects
    this.length = this.getLength();
  }

  getLength() {
    let length = 0;
    for (let line of this.text) {
      length += line.length;
    }
    return length
  }
};
