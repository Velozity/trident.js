#!/usr/bin/env node

// Usage: npx create-trident-app

const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Create a project directory with the project name.
const currentDir = process.cwd();
const projectDir = currentDir;
fs.mkdirSync(projectDir, { recursive: true });

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const templateDir = path.resolve(__dirname, "template");
fs.cpSync(templateDir, projectDir, { recursive: true });

const projectPackageJson = require(path.join(projectDir, "package.json"));

// Update the project's package.json with the new project name
projectPackageJson.name = "my-trident-bot";

fs.writeFileSync(
  path.join(projectDir, "package.json"),
  JSON.stringify(projectPackageJson, null, 2)
);

// Run `npm install` in the project directory to install
// the dependencies. We are using a third-party library
// called `cross-spawn` for cross-platform support.
// (Node has issues spawning child processes in Windows).
spawn.sync("npm", ["install"], { stdio: "inherit" });

console.log(chalk.bold.blue(`Trident.js starter template deployed!`));
