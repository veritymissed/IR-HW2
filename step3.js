var fs = require('fs');
var stemmer = require('porter-stemmer').stemmer;
var keyword_extractor = require("keyword-extractor");
var doc1 = process.argv[2];
var doc2 = process.argv[3];
var doc1_unit_vec = JSON.parse(fs.readFileSync('./tf-idf/' + doc1.toString() + '.txt'));
// console.log(doc1_unit_vec);
var doc2_unit_vec = JSON.parse(fs.readFileSync('./tf-idf/' + doc2.toString() + '.txt'));
// console.log(doc2_unit_vec);
// console.log('./tf-idf/' + doc1.toString() + '.txt');
var cos_sim = 0;
for (var vrb in doc1_unit_vec) {
    if (doc1_unit_vec.hasOwnProperty(vrb)) {
        if (doc2_unit_vec[vrb])
            cos_sim += (doc1_unit_vec[vrb] * doc2_unit_vec[vrb]);
    }
}

console.log("The cosine similarity of doc" + process.argv[2] + " and doc" + process.argv[3] + " is : " + cos_sim);
