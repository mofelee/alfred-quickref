const Fuse = require("fuse.js");
const data = require("./data.json");
let input = process.argv[2] || "";

const TOPICPATH = process.env.TOPICPATH;
const TOPICKEY = process.env.TOPICKEY;
const TOPICLEVEL = process.env.TOPICLEVEL;
const TOPICHASH = process.env.TOPICHASH;
const TOPICNAME = process.env.TOPICNAME;
const TOPICPARENTTITLE = process.env.TOPICPARENTTITLE || "";

const level = parseInt(TOPICLEVEL, 10);

const index = data.findIndex((v) => v.path == TOPICPATH);

if (index == -1) {
  output([{ title: "参数有误" }]);
  process.exit(0);
}

const topic = data[index];

let sections = [];
if (level === 2) {
  sections = topic.sections.filter((v) => v.l === 2);
} else {
  // level === 3

  const startIndex = topic.sections.findIndex((v) => v.a === TOPICHASH);
  for (let i = startIndex + 1; i < topic.sections.length; i++) {
    const section = topic.sections[i];
    if (section.l === 2) {
      break;
    }
    sections.push(section);
  }
}

if (input === "") {
  output(sections.map((item) => mapOutputItem(item)));
  process.exit(0);
}

const options = {
  //includeScore: true,
  keys: [
    {
      name: "t",
      weight: 1,
    },
  ],
};

const fuse = new Fuse(sections, options);

const result = fuse.search(input);

output(result.map(({ item }) => mapOutputItem(item)));

function mapOutputItem(item) {
  const prefix = `【${TOPICNAME}${
    TOPICPARENTTITLE ? ` > ${TOPICPARENTTITLE}` : ""
  }】`;
  title = `${item.t} ${level === 2 ? ">" : ""}`;

  const mods = {};
  if (level === 2) {
    mods.cmd = {
      valid: true,
      title,
      arg: TOPICKEY,
      subtitle: `检索【${TOPICNAME} > ${item.t}】的章节`,
      variables: {
        MODE: "sectionsearch",
        TOPICHASH: item.a,
        TOPICLEVEL: 3,
        TOPICPARENTTITLE: item.t,
        TOPICKEY: item.key,
      },
    };
  }

  return {
    title,
    subtitle: prefix,
    arg: TOPICKEY,
    variables: {
      MODE: "openpage",
      TOPICHASH: item.a,
      TOPICKEY: item.key,
    },
    mods,
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
