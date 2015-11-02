var fs = require('fs');
var stemmer = require('porter-stemmer').stemmer;
var keyword_extractor = require("keyword-extractor");
var input_path = process.argv[2];
var output_path = process.argv[3];
