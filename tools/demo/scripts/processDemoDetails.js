import * as util from './util';

let defaultDemoDetailsContent = '' + 
'---' + '\n' +
' name: Highcharts Demo\n' +
' authors: ' + '\n' +
'   - Torstein Hønsi' + '\n' + 
' js_wrap: b' + '\n' + 
'...';

let demoPath = '../../samples/highcharts';
let fileName = 'demo.details'

util.findAllFiles(demoPath, (err, result) => {        
    for(let i = 0; i < result.length; i++) {
        if (result[i].indexOf(fileName) >= 0) {
            let parsedDemoDetails = util.readYamlFile(result[i]);
            if (! parsedDemoDetails.hasOwnProperty('js_wrap')) {
                parsedDemoDetails['js_wrap'] = 'b';
            }
            // Write demo details back to disk.
            util.writeYamlFile(result[i], parsedDemoDetails);
        }
    }
});  
