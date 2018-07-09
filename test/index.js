const slueFs = require('../index');
const slueStream = require('slue-stream');

slueFs.read('./test/a.js').pipe(slueStream.transformObj(function(obj, env, cb) {
    cb(null, obj);
})).pipe(slueFs.write('./test/park'));
slueFs.read('./test/b.js').pipe(slueStream.transformObj(function(obj, env, cb) {
    cb(null, obj);
})).pipe(slueFs.write('./test/park'));