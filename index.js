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
  //includeScore: true,
  keys: [
    {
      name: "key",
      weight: 0.6,
    },
    {
      name: "title",
      weight: 0.2,
    },
    {
      name: "intro",
      weight: 0.2,
    },
  ],
};

const fuse = new Fuse(searchData, options);

const result = fuse.search(input);

output(result.map(({ item }) => mapOutputItem(item)));

function mapOutputItem(item) {
  return {
    valid: true,
    title: `【${item.key}】${item.title}`,
    subtitle: item.intro,
    arg: item.key,
    variables: {
      MODE: "openpage",
      TOPICPATH: item.path,
      TOPICHASH: "",
    },
    mods: {
      cmd: {
        valid: true,
        title: `【${item.key}】${item.title}`,
        arg: item.key,
        subtitle: `检索【${item.key}】的章节`,
        variables: {
          MODE: "sectionsearch",
          TOPICPATH: item.path,
          TOPICLEVEL: 2,
          TOPICKEY: item.key,
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
