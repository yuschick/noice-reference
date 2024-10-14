const fs = require('fs');
const path = require('path');

const jsonFile = process.argv[2];
const findDependantsFor = path.resolve(process.argv[3]);

const data = fs.readFileSync(jsonFile, 'utf8');

const json = JSON.parse(data);

const nodeMetas = json.nodeMetas;
const depNode = Object.values(nodeMetas).find(node => node.id === findDependantsFor);


function walk(node, depth = 0, visited = {}) {
  if (Object.keys(node.moduleParts).length > 0) {
    if (!node.moduleParts['js/index.js']) {
      console.log('  '.repeat(depth) + "separate bundle: " + Object.keys(node.moduleParts).join(', '));
      return;
    }
  }

  console.log('  '.repeat(depth) + node.id);

  if (visited[node.id]) {
    console.log('  '.repeat(depth+1) + 'Already visited');
    return;
  }
  visited[node.id] = true;


  node.importedBy.forEach(({uid}) => {
    const node = nodeMetas[uid];
    walk(node, depth + 1, {...visited});
  });

}

walk(depNode);