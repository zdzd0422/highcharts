import * as util from './util';
import beautify from 'js-beautify';

let demoPath = '../../samples/highcharts';
let fileName = 'demo.js'

util.findAllFiles(demoPath, (err, result) => {
    for(let i = 0; i < result.length; i++) {
        if(result[i].indexOf(fileName) >= 0) {
            console.log('Processing file: ' + result[i] + '...')
            let fileContent = util.readFile(result[i]);
            
            // Search for $(function
            let onReadyIndex = fileContent.indexOf('$(function');
            if(onReadyIndex < 0){
                continue;
            }
            
            let parenthesis = {
                count: 0,
                modified: false,
                closeIndex: undefined,
                openIndex: undefined
            }
            
            let curly = {
                count: 0,
                modified: false,
                closeIndex: undefined,
                openIndex: undefined
            }
            
            function onReadyContent(parenthesis, curly, fileContent){
                for(let j = onReadyIndex; j < fileContent.length; j++){
                    let char = fileContent.charAt(j);
                    switch(char){
                        case '(':
                            parenthesis.count++;
                            parenthesis.modified = true;
                            break;
                        
                        case ')':
                            parenthesis.count--;
                            break;
                        
                        case '{':
                            curly.count++;
                            curly.modified = true;
                            break;
                            
                        case '}':
                            curly.count--;
                            break;
                    }
                    
                    if(parenthesis.count === 1 && parenthesis.openIndex === undefined){
                        parenthesis.openIndex = j;
                    }
                    
                    if(curly.count === 1 && curly.openIndex === undefined){
                        curly.openIndex = j;
                    }
                    
                    if(parenthesis.count === 0 && parenthesis.modified && parenthesis.closeIndex === undefined){
                        parenthesis.closeIndex = j;
                    }
                    
                    if(curly.count === 0 && curly.modified && curly.closeIndex === undefined){
                        curly.closeIndex = j;
                    }
                }

            }
            
            function cut(from, upTo, fileContent) {
                return fileContent.substring(0, from).concat(fileContent.substring(upTo, fileContent.length))
            }
            
            onReadyContent(parenthesis, curly, fileContent);
            fileContent = cut(curly.closeIndex, parenthesis.closeIndex +2, fileContent);
            fileContent = cut(onReadyIndex, curly.openIndex +1, fileContent);
            
            util.writeFile(result[i], beautify(fileContent));
        }
    }
});
