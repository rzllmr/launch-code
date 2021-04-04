const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

class CodeCheck {
  constructor() {
    if (!CodeCheck.instance) {
      this.compiling = false;
      this.clearDirectory('compiled');

      CodeCheck.instance = this;
    }
    return CodeCheck.instance;
  }

  compile(filesToCompile) {
    return new Promise((resolve, reject) => {
      console.log('compiling');
      this.compiling = true;
      this.createConfig('tsconfig-select.json', filesToCompile);
      exec(`npm run tsc -- -p tsconfig-select.json`, (error, stdout, _) => {
        fs.rmSync('tsconfig-select.json');
        this.compiling = false;
        if (error) {
          const errors = [];
          // example: "code/subdir/part.ts(5,21): error TS1005: ';' expected."
          const errorPattern = /^(.*)\((\d+),(\d+)\): error (.*): (.*)/;
          for (const line of stdout.split('\n')) {
            if (line.includes('error')) {
              const match = line.match(errorPattern);
              if (match && filesToCompile.includes(match[1])) {
                errors.push(new CompileError(match));
              }
            }
          }
          reject(errors);
        }
        const allJsFiles = this.filesInDir('compiled');
        const files = this.relatedJsFiles(allJsFiles, filesToCompile);
        resolve(files);
      });
    });
  }

  async require(jsFiles) {
    console.log('requiring');
    const modules = [];
    for (const jsFile of jsFiles) {
      const module = require('../' + jsFile);
      modules.push(module);
    }
    return modules;
  }

  async instance(modules, className) {
    console.log('instancing');
    let object = null;
    for (const module of modules) {
      if (className in module) {
        object = new module[className]();
      }
    }
    if (object == null) throw new Error('no class of that name');
    return object;
  }

  async property(object, propertyName) {
    console.log('properting');
    let value = null;
    if (propertyName in object) {
      value = object[propertyName];
    }
    if (value == null) throw new Error('no property of that name');
    return value;
  }

  filesInDir(dirPath, listOfFiles = []) {
    for (const file of fs.readdirSync(dirPath)) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        listOfFiles = this.filesInDir(filePath, listOfFiles);
      } else {
        listOfFiles.push(filePath.replace(/\\/g, '/'));
      }
    }
    return listOfFiles;
  }

  relatedJsFiles(allJsFiles, tsFiles) {
    const relatedJsFiles = [];
    const tsFilesRel = tsFiles.map((path) =>
      path.replace(/.*code\/(.+)\.ts/, '$1.js'));
    for (const jsFile of allJsFiles) {
      const jsFileRel = jsFile.replace(/.*compiled\//, '');
      if (tsFilesRel.includes(jsFileRel)) {
        relatedJsFiles.push(jsFile);
      }
    }
    return relatedJsFiles;
  }

  clearDirectory(dirPath) {
    fs.rmdirSync(dirPath, {recursive: true});
    fs.mkdirSync(dirPath);
  }

  createConfig(configPath, filesToCompile) {
    const content = {
      extends: './tsconfig.json',
      exclude: ['code/**/*.ts'],
      files: filesToCompile
    };

    try {
      const data = JSON.stringify(content, null, 2);
      fs.writeFileSync(configPath, data, 'utf8');
    } catch (err) {
      console.log(`error writing file: ${err}`);
    }
  }
}

class CompileError {
  constructor(match) {
    if (match.length != 6) return null;

    this.file = match[1];
    this.line = match[2];
    this.column = match[3];
    this.code = match[4];
    this.message = match[5];
  }
}

module.exports = CodeCheck;
