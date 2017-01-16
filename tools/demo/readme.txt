Run 'npm run' in terminal to see scipts

- 'demo:jquery:remove' removes jQuery constructors from all demo.js files
- 'demo:details' checks for demo.details files, creates for every folder if not exist, and adds js_wrap: b to all.
- 'demo:fix:html' ,NOT FINISHED, will check for remaining jQuery calls from demo.js files and make sure they have links to jQuery in the html file in the same folder.

util.js har the following methods:

- findAllFiles(dir, done):  find all files in parameter directory
- findDirWithoutFile(dir, fileName, done): finds directories without paramenter file name in parameter directory 
- writeYamlFile(filePath, obj, defaultYamlContent)
- writeFile(filePath, str)
- readYamlFile(filePath)
- readFile(filePath)
