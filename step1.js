var fs = require('fs');
var stemmer = require('porter-stemmer').stemmer;
var keyword_extractor = require("keyword-extractor");
var input_dir_path = process.argv[2];
var input_dir_files = fs.readdirSync(input_dir_path);
var N = input_dir_files.length;

var df_dictionary = {};
var cf_dictionary = {};
var idf_dictionary = {};

input_dir_files.forEach(function(val, idx, arr) {
    var input_path = input_dir_path + '/' + val;
    var ouputDocID_path = input_dir_path + '/' + (idx + 1).toString() + '_output.txt';

    var inputRawData = fs.readFileSync(input_path, 'utf8');
    inputRawData = inputRawData.replace(/(\r\n|\n|\r|\')/gm, "");
    inputRawData = inputRawData.replace(".", "");
    inputRawData = inputRawData.replace(",", "");
    inputRawData = inputRawData.replace(/"([^"]*)"/g, "");

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
    // console.log(inputRawData);

    inputRawData.forEach(function(val, idx, arr) {
        if (cf_dictionary[val])
            cf_dictionary[val] += 1
        else
            cf_dictionary[val] = 1;
    });
    for (var vrb in cf_dictionary) {
        if (cf_dictionary.hasOwnProperty(vrb)) {
            if (inputRawData.indexOf(vrb) >= 0) {
                if (df_dictionary[vrb]) {
                    df_dictionary[vrb] += 1;
                } else {
                    df_dictionary[vrb] = 1;
                }
            }
        }
    }
});

for (var vrb in df_dictionary) {
    if (df_dictionary.hasOwnProperty(vrb)) {
        idf_dictionary[vrb] = Math.log10(N / df_dictionary[vrb]);
    }
}

fs.writeFileSync('./dictionary.txt', JSON.stringify(df_dictionary));
fs.writeFileSync('./idf_dictionary.txt', JSON.stringify(idf_dictionary));
