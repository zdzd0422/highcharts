import * as util from './util';

let demoPath = '../../samples/highcharts';
let fileName = 'demo.html';


// Search through all files
util.findAllFiles(demoPath, (err, result) => {        
    for(let i = 0; i < result.length; i++) {
        
        if (result[i].indexOf('demo.js') >= 0) {
            let jsFileContent = util.readFile(result[i]);
            if(jsFileContent.match(/\$./g) || jsFileContent.match(/\$[ ]*\(/g)){
                if(result[i].indexOf('demo.html') >= 0) {
                    let htmlFileContent = util.readFile(result[i]);
                    console.log(htmlFileContent);
                }
            }
        }
    }
});
