/* eslint-disable */

var fs = require('fs-extra'),
jsyaml = require('js-yaml'),
esprima = require('esprima'),
escodegen = require('escodegen'),
estraverse = require('estraverse');

var settings = {
    createDemoJs: false,
    createDemoDetails: false,
    fixDemoDetails: false
}

// Asynchronous function to read folders and files recursively

// Need to remove documentReady when only one $ usage in demo.js files
// Need to remove spaces for indenting these files


// demo.js
// Read file
// Count $ occurences globally in file (regex).  file.match(/\\$/(), g).length
// If numberofJQueryUsages > 1
//   process file line by line
// 
// Write processed file back to disk.

var demoPath = "../../samples/highcharts";

if(settings.fixDemoDetails) {
    findAllFiles(demoPath, function(err, result){        
        for(var i = 0; i < result.length; i++) {
            if(result[i].indexOf("demo.details") >= 0) {
                var parsedDemoDetails = readYamlFile(result[i]);
                if (! parsedDemoDetails.hasOwnProperty('js_wrap')) {
                    parsedDemoDetails['js_wrap'] = 'b';
                }
                
                // Write demo details back to disk.
                writeDemoDetails(result[i], parsedDemoDetails);
            }
        }
    });    
}

findAllFiles(demoPath, function(err, result){
    for(var i = 0; i < result.length; i++) {
        if(result[i].indexOf("demo.js") >= 0) {
            var fileContent = readJsFile(result[i]),
            regex = fileContent.match(/\$[\(\.]{1}/g),
            shouldProcessFile = regex && regex.length === 1;
            
            if(! shouldProcessFile) {
                continue;
            }
            
            ast = esprima.parse(fileContent, { comment: true , attachComment: true });
            var innerArray = [];
            var arrayIndex = -1;
            ast.body.forEach( function(element, index){
                if(element.type === 'ExpressionStatement' 
                    && element.expression
                    && element.expression.arguments 
                    && element.expression.callee
                    && element.expression.callee.name === '$') {
                    innerArray = element.expression.arguments[0].body.body.slice();
                    arrayIndex = index;    
                }
            });
            
            ast.body = ast.body.slice(0,arrayIndex).concat(innerArray).concat(ast.body.slice(arrayIndex + 1, ast.body.length))
            
            writeDemoJs(result[i], escodegen.generate(ast, { comment: true }));
            
        }
    }
});   

if(settings.createDemoDetails){
    findDirWithoutFile(demoJSPath, function(err, result){
        var demoJSFiles = [];
        for(i = 0; i < result.length; i++) {
            var filePath = result[i] + "/demo.details"
            writeDemoDetails(filePath);
        }
    });
}

function findAllFiles(dir, done) {
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

function findDirWithoutFile(dir, done) {
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
            if(!hasDemoDetails && file.indexOf("demo.details") >= 0){
                hasDemoDetails = true;
            }
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    findDirWithoutFile(file, function(err, res) {
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

function writeDemoDetails(filePath, obj){
    if (! obj) {
        // Write this thing to disk
        var defaultDemoDetailsContent = "" + 
        "---" + "\n" +
        " name: Highcharts Demo\n" +
        " authors: " + "\n" +
        "   - Torstein Hønsi" + "\n" + 
        " js_wrap: b" + "\n" + 
        "...";         
        
        obj = jsyaml.safeLoad(defaultDemoDetailsContent);
    }
    try {
        fs.outputFileSync(filePath, jsyaml.safeDump(obj));
    } catch (ex) {
        console.log("Error writing ", filePath);
    }
}

function writeDemoJs(filePath, str){
    try {
        fs.outputFileSync(filePath,str);
    } catch (ex) {
        console.log("Error writing ", filePath);
    }
}

function readYamlFile(filePath){
    try {
        return jsyaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    } catch (ex) {
        console.log("Error parsing", filePath);
    }
}

function readJsFile(filePath){
    return fs.readFileSync(filePath, 'utf8');
}
