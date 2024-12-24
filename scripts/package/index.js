const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const chalk = require('chalk');
const { resolvePath } = require('../utils');
const { execSync } = require('child_process');

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

const createBuildPackage = async () => {
  try {
    let vitePath = require.resolve('vite');
    let viteBinPath = path.join(vitePath, '../..', '.bin', 'vite');
    let configFilePath = path.resolve(__dirname, './vite-config-prod.js');
    execSync(`${viteBinPath} build --config "${configFilePath}"`);

    console.log(chalk.gray('Compressing bundle...'));
    let distPath = resolvePath('dist');
    let distContentPath = resolvePath('dist/content');
    const { version, name } = await fs.readJson(path.resolve(distContentPath, 'package.json'));
    const bundleName = `${name}-bundle-${version}.inc`;
    await zipDirectory(distContentPath, path.join(distPath, bundleName));
    console.log(
      chalk(`${chalk.green('✅ ')} Your bundle is ready at ${chalk.cyan(`dist/${bundleName}`)} `)
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = createBuildPackage;
