# slue-fs

## read
```javascript
    const slueFs = require('slue-fs');
    const slueModule = require('slue-module');
    slueFs.read(['./src/**/*.js']).pipe(slueModule.transformObj(function(file, env, cb) {
        console.log(file);
        cb(null, file);
    }));
```

## write
```javascript
    const slueFs = require('slue-fs');
    const slueModule = require('slue-module');
    slueFs.read('./test/a.js').pipe(slueStream.transformObj(function(obj, env, cb) {
        cb(null, obj);
    })).pipe(slueFs.write('./test/park'));
```

## watch
```javascript
    const slueFs = require('slue-fs');
    let watcher = slueFs.watch(allFile);
    watcher.on('change', function(filePath, stat) {
        
    });
```