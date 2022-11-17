const Fuse = require("fuse.js");
const list = require("./list.json");
let input = process.argv[2];

function output(items) {
  console.log(
    JSON.stringify({
      return: 0.1,
      items,
    })
  );
}
const options = {
  //includeScore: true,
};

const fuse = new Fuse(list, options);

const result = fuse.search(input);

output(result.map((v) => ({ title: v.item, arg: v.item })));
