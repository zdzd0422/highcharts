var fs = require('fs-extra'),
    jsyaml = require('js-yaml'),
    esprima = require('esprima'),
    escodegen = require('escodegen');


export function findAllFiles(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list){
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    findAllFiles(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
}


export function findDirWithoutFile(dir, fileName, done) {
    var results = [];
    fs.readdir(dir, function(err, list){
        if (err) {
            return done(err);
        }
        var i = 0,
        hasDemoDetails = false;
        (function next() {
            var file = list[i++];
            if (!file) {
                return done(null, results);
            }
            if(!hasDemoDetails && file.indexOf(fileName) >= 0){
                hasDemoDetails = true;
            }
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    findDirWithoutFile(file, fileName, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if(i === list.length && !hasDemoDetails) {
                        results.push(dir);
                    }
                    next();
                }
            });
        })();
    });
}

export function writeYamlFile(filePath, obj, defaultYamlContent){
    try {
        fs.outputFileSync(filePath, ! obj ? jsyaml.safeLoad(defaultYamlContent) : jsyaml.safeDump(obj));
    } catch (ex) {
        console.log('Error writing ', filePath);
    }
}

export function writeFile(filePath, str) {
    try {
        fs.outputFileSync(filePath,str);
    } catch (ex) {
        console.log('Error writing ', filePath);
    }
}

export function readYamlFile(filePath){
    try {
        return jsyaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    } catch (ex) {
        console.log('Error parsing', filePath);
    }
}

export function readFile(filePath){
    try {
        return fs.readFileSync(filePath, 'utf8');    
    } catch (ex) {
        console.log('Error reading', filePath);
    }
    
}
