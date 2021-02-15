#!/usr/bin/env node

const log = console.log;
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const args = parseArguments(process.argv.slice(2));

if (args?.cmd === 'create') {
  log('📄 Creating project files...');
  createProject().then(() => log('✨ Done'));
}

function createProject() {
  const templateDir = path.resolve(__dirname, '../templates');
  return copyTemplateFiles(templateDir, process.cwd());
}

function copyTemplateFiles(src, dest) {
  return fs.copy(src, dest, {
    filter: filterTemplateFile,
    overwrite: false,
  });
}

function filterTemplateFile(src, dest) {
  if (fs.lstatSync(src).isFile()) {
    if (fs.existsSync(dest)) {
      log(`${chalk.red('exists')}  ${formatTemplateFileName(src)}`);
    } else {
      log(`${chalk.green('created')} ${formatTemplateFileName(src)}`);
    }
  }
  return true;
}

function formatTemplateFileName(filepath) {
  return filepath.split('templates/')[1];
}

function parseArguments(args) {
  const [cmd = ''] = args;

  if (cmd !== 'create') {
    log(`${chalk.red('error')} Command "${cmd}" not found.`);
    return null;
  }

  return {
    cmd,
  };
}
