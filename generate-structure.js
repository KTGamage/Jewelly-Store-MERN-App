const fs = require("fs");
const path = require("path");

const ignoreFolders = ["node_modules", ".git", "dist", "build", ".vercel"];

function generateTree(dir, prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let tree = "";

  for (const file of files) {
    if (ignoreFolders.includes(file.name)) continue;
    const isDir = file.isDirectory();
    tree += `${prefix}${isDir ? "├── " : "│   "}${file.name}\n`;
    if (isDir) tree += generateTree(path.join(dir, file.name), prefix + "│   ");
  }

  return tree;
}

const tree = generateTree(process.cwd());
fs.writeFileSync("structure.txt", tree);
console.log("✅ Project structure saved to structure.txt");
