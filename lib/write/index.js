const util = require('util');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const glob2base = require('glob2base');
const File = require('vinyl');
const slueStream = require('slue-stream');

function write(folder) {
    if (!util.isString(folder) && !util.isFunction(folder)) {
        throw new Error('Invalid output folder');
    }

    let cwd = process.cwd();

    function saveFS(file, env, cb) {
        let basePath = '';
        if (util.isString(folder)) {
            basePath = path.resolve(cwd, folder);
        }
        if (util.isFunction(folder)) {
            basePath = path.resolve(cwd, folder(file));
        }

        let filePath = path.resolve(basePath, file.relative);
        let fileFoler = path.dirname(filePath);

        file.cwd = cwd;
        file.base = basePath;
        file.path = filePath;

        mkdirp(fileFoler, function(err) {
            if (err) {
                return cb(err);
            }

            fs.writeFileSync(filePath, file.contents.toString());

            cb(null, file);
        });
    }
    let stream = slueStream.transformObj(saveFS);
    return stream;
};

module.exports = write;