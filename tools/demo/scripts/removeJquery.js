import * as util from './util';
import esprima from 'esprima';
import escodegen from 'escodegen';
import traverse from 'traverse';
import beautify from 'js-beautify';

// let demoPath = '../../../../Desktop/lol'
let demoPath = '../../samples/highcharts';
let fileName = 'demo.js'

util.findAllFiles(demoPath, (err, result) => {
    for(let i = 0; i < result.length; i++) {
        if(result[i].indexOf(fileName) >= 0) {
            console.log('Processing file: ' + result[i] + '...')
            let fileContent = util.readFile(result[i]);
            let ast = esprima.parse(fileContent, { comment: true , attachComment: true });
            let innerArray = [];
            let arrayIndex = -1;
            ast.body.forEach((element, index) => {
                if (element.type === 'ExpressionStatement' 
                && element.expression
                && element.expression.arguments 
                && element.expression.arguments.length === 1 
                && element.expression.callee
                && element.expression.callee.name === '$'
                && element.expression.arguments[0].type === 'FunctionExpression') {
                    
                    innerArray = element.expression.arguments[0].body.body.slice();
                    arrayIndex = index;    
                }
            });
            
            ast.body = ast.body.slice(0,arrayIndex)
            .concat(innerArray)
            .concat(ast.body.slice(arrayIndex + 1, ast.body.length));
            
            
            // Traverse through AST and look for trailing or leading comments.
            let commentSet = new Set();
            traverse(ast).forEach(function (x) {
                if(! x) {
                    return;
                }
                if (x.hasOwnProperty('leadingComments')) {
                    x.leadingComments.forEach(comment => {
                        let commentString = JSON.stringify(comment);
                        if (! commentSet.has(commentString)) {
                           commentSet.add(commentString);
                        }
                    });
                }
            });
            
            traverse(ast).forEach(function(x) {
                if(! x) {
                    return;
                }
                if (x.hasOwnProperty('trailingComments')) {
                    let newTrailingComments = [];
                    x.trailingComments.forEach(comment => {
                        let commentString = JSON.stringify(comment);
                        if (! commentSet.has(commentString)) {
                            newTrailingComments.push(comment);
                        }
                        let res = Object.assign({}, x);
                        res.trailingComments = newTrailingComments;
                        this.update(res);
                    });
                }
            });
            
            let demoContent = escodegen.generate(ast, { comment: true });
            
            let arrayStart = [];
            for(let i = 0; i < demoContent.length; i++){
                let char = demoContent.charAt(i);
                if(char === '['){
                    arrayStart.push(i);
                }
            }

            const illegalSymbol = char => {
                return char === '[' || char === ']' ;
            }
            
            let arrayRanges = [];
            arrayStart.forEach(i => {
                for (let y = i + 1; y < demoContent.length; y++) {
                    let char = demoContent.charAt(y);
                    if (char === ']'){
                        arrayRanges.push({ from: i, to: y });
                        break;
                    }
                    if (illegalSymbol(char)) {
                        break;
                    }
                }
            });

            arrayRanges = arrayRanges.reverse();
            arrayRanges.forEach(range => {                
                let prettySubstring = demoContent.substring(range.from, range.to + 1).replace(/\s/g,'').replace(/,/g, ', ');
                demoContent = demoContent.substring(0, range.from) + prettySubstring + demoContent.substring(range.to + 1, demoContent.length);
            });
            util.writeFile(result[i], beautify(demoContent));
        }
    }
});
