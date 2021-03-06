const util = require('util');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const glob2base = require('glob2base');
const File = require('vinyl');
const slueStream = require('slue-stream');

function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

function read(globs, options = {}) {
    if (!isValidGlob(globs)) {
        throw new Error('Invalid glob argument: ' + glob);
    }

    let stream = slueStream.transformObj();

    if (util.isArray(globs)) {
        if (glob.length === 0) {
            process.nextTick(stream.end.bind(stream));
            return stream;
        }
    } else {
        globs = [globs];
    }

    let cwd = process.cwd();
    let streams = globs.map(function(theGlob) {
        let stream = slueStream.transformObj();

        let globIndtance = new glob.Glob(theGlob);
        let basePath = glob2base(globIndtance);

        globIndtance.on('error', stream.emit.bind(stream, 'error'));
        globIndtance.on('end', function() {
            stream.end();
        });

        globIndtance.on('match', function(filename) {
            let globFile = Object.assign({}, options);
            globFile.cwd = cwd;
            globFile.base = basePath;
            globFile.path = path.resolve(cwd, filename);

            let contents = fs.readFileSync(globFile.path, 'utf8');
            contents = stripBOM(contents);
            globFile.contents = new Buffer(contents);
            stream.push(globFile);
        });

        return stream;
    });

    let theStream = streams.length === 1 ? streams[0] : slueStream.combine(streams);

    return theStream.pipe(slueStream.transformObj(function(globFile, env, cb) {
        cb(null, new File(globFile));
    }))
};

module.exports = read;

function isValidGlob(glob) {
    if (typeof glob === 'string') {
        return true;
    }
    if (Array.isArray(glob) && glob.length !== 0) {
        return glob.every(isValidGlob);
    }
    if (Array.isArray(glob) && glob.length === 0) {
        return true;
    }
    return false;
}