const Fuse = require("fuse.js");
const data = require("./data.json");
let input = process.argv[2] || "";

const searchData = data.map((v) => {
  v.key = v.path.replace(/docs\/(.+)\.html$/, "$1");
  return v;
});

if (input === "") {
  output(searchData.map((item) => mapOutputItem(item)));
  process.exit(0);
}

const options = {
  includeScore: false,
  shouldSort: true,
  threshold: 0.2,
  keys: [
    { name: "name", weight: 100 },
    { name: "tags", weight: 10 },
    { name: "intro", weight: 2 },
  ],
};

const fuse = new Fuse(searchData, options);

const result = fuse.search(input);

output(result.map(({ item }) => mapOutputItem(item)));

function mapOutputItem(item) {
  return {
    valid: true,
    title: `${item.name}`,
    subtitle: `${item.intro}`,
    arg: item.key,
    variables: {
      MODE: "openpage",
      TOPICPATH: item.path,
      TOPICHASH: "",
      TOPICNAME: item.name,
    },
    mods: {
      cmd: {
        valid: true,
        arg: item.key,
        subtitle: `检索【${item.name}】的章节`,
        variables: {
          MODE: "sectionsearch",
          TOPICPATH: item.path,
          TOPICLEVEL: 2,
          TOPICKEY: item.key,
          TOPICNAME: item.name,
        },
      },
    },
  };
}

function output(items) {
  console.log(
    JSON.stringify({
      return: 0.1,
      items,
    })
  );
}
