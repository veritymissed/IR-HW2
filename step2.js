var fs = require('fs');
var stemmer = require('porter-stemmer').stemmer;
var keyword_extractor = require("keyword-extractor");
var input_dir_path = process.argv[2];
var input_dir_files = fs.readdirSync(input_dir_path);

var tf_dictionary = {};
var idf_dictionary = {};

var idfDicObj = JSON.parse(fs.readFileSync('./idf_dictionary.txt'));

input_dir_files.forEach(function(val, idx, arr) {
    var input_path = input_dir_path + '/' + val;
    var outputTfPath = './tf/' + (idx + 1).toString() + '.txt';
    var outputTfIdfPath = './tf-idf/' + (idx + 1).toString() + '.txt';

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
    var tf = {};
    var tf_idf = {};

    inputRawData.forEach(function(val, idx, arr) {
        if (tf[val]) {
            tf[val] += 1;
        } else {
            tf[val] = 1;
        }
    });

    var lengthOfTfIdfVec = 0;
    for (var vrb in tf) {
        if (tf.hasOwnProperty(vrb)) {
            tf_idf[vrb] = tf[vrb] * idfDicObj[vrb];
        }
        // console.log(Math.pow(tf_idf[vrb], 2));
        lengthOfTfIdfVec += Math.pow(tf_idf[vrb], 2);
    }
    // console.log(lengthOfTfIdfVec);
    lengthOfTfIdfVec = Math.sqrt(lengthOfTfIdfVec);
    // console.log(lengthOfTfIdfVec);

    for (var vrb in tf) {
        if (tf.hasOwnProperty(vrb)) {
            tf_idf[vrb] = tf_idf[vrb] / lengthOfTfIdfVec;
        }
    }

    fs.existsSync('./tf') || fs.mkdirSync('./tf');
    fs.existsSync('./tf-idf') || fs.mkdirSync('./tf-idf');
    fs.writeFileSync(outputTfPath, JSON.stringify(tf));
    fs.writeFileSync(outputTfIdfPath, JSON.stringify(tf_idf));
});
