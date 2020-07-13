const Generator = require('yeoman-generator');
const R = require('ramda');
const {camelCase, paramCase} = require('change-case');

module.exports = class extends Generator {
  _fileCreator({filepath, filename}) {
    const path = filepath.replace(/^app\//, '').replace(/\/$/, '');
    const name = paramCase(filename.replace(/\.js/, ''));

    this.fs.copyTpl(
      this.templatePath('code-file.ejs'),
      this.destinationPath(`app/${path}/${name}.js`),
      {filenameAsFunction: camelCase(name)}
    );

    this.fs.copyTpl(
      this.templatePath('test-file.test.ejs'),
      this.destinationPath(`test/app/${path}/${name}.test.js`),
      {
        filenameAsFunction: camelCase(name),
        filepath: `app/${path}/${name}.js`,
        requirePath: R.pipe(
          R.split(/\//),
          R.length,
          R.add(2),
          R.repeat('..'),
          R.join('/')
        )(path)
      }
    );
  }

  async createFile() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'file name?'
      },
      {
        type: 'input',
        name: 'filepath',
        message: 'file path?'
      }
    ]);

    this._fileCreator(answers);
    this.config.save();
  }
};
