/* eslint-disable */

var fs = require('fs-extra'),
    jsyaml = require('js-yaml'),
    path = ".";

// Asynchronous function to read folders and files recursively

// Need to make a list of all the demo.js files
// Need a regex to count the $ in a demo.js files
// Need to remove documentReady when only one $ usage in demo.js files
// Need to remove spaces for indenting these files

var demoJSPath = "../../samples/highcharts";

findAllFiles(demoJSPath, function(err, result){
  var demoJSFiles = [];
  
  for(var i = 0; i < result.length; i++) {
    if(result[i].indexOf("demo.details") >= 0) {
        var parsedDemoDetails = readDemoDetails(result[i]);
        if (! parsedDemoDetails.hasOwnProperty('js_wrap')) {
            parsedDemoDetails['js_wrap'] = 'b';
        }
        
        // Write demo details back to disk.
        writeDemoDetails(result[i], parsedDemoDetails);
    }
  }
});

findDirWithoutFile(demoJSPath, function(err, result){
    var demoJSFiles = [];
    for(i = 0; i < result.length; i++) {
        var filePath = result[i] + "/demo.details"
        writeDemoDetails(filePath);
    }
});

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

function readDemoDetails(filePath){
    try {
        return jsyaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    } catch (ex) {
        console.log("Error parsing", filePath);
    }
}
