var fs = require('fs');
var stemmer = require('porter-stemmer').stemmer;
var keyword_extractor = require("keyword-extractor");
var input_path = process.argv[2];
var output_path = process.argv[3];
console.log("Input file name: " + input_path);

var inputRawData = fs.readFileSync(input_path, 'utf8');
inputRawData = inputRawData.replace(/(\r\n|\n|\r|\')/gm, "");
inputRawData = inputRawData.replace(".", "");

inputRawData = keyword_extractor.extract(inputRawData, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false

});

inputRawData.forEach(function(val, idx, arr) {
    arr[idx] = stemmer(val);
    arr[idx] = val.toLowerCase();
});

fs.writeFileSync(output_path,inputRawData);
