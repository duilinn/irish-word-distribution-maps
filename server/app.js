const express = require('express')
var request = require('request')
var cors = require('cors')
const http = require("http");
const querystring = require('node:querystring');
const fs = require('fs');
const { match } = require('assert');
const { parse } = require("csv-parse");
const PORT = process.env.PORT || 5000;
const app = express()
const port = PORT;//5000
app.use(cors());

const filePath = 'public/volumes_simplified_full_counties.json';
let jsonData = {};

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        // Parse the JSON data
        jsonData = JSON.parse(data);

        // Access the data in the JSON object
        console.log("number of volumes: " + jsonData.length +
            " number of items in volume 0001: " + jsonData[0].length);
    } catch (err) {
        console.error('Error parsing the JSON data:', err);
    }
});

const data = []
fs.createReadStream("public/lasid/array_data_unicode.txt")
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        // console.log(r);
        data.push(r);
    })
    .on('end', () => {
        // console.log(data);
    })

const locationsInfo = []
fs.createReadStream("public/lasid/locations_info.csv")
    .pipe(parse({ delimiter: '\t' }))
    .on('data', (r) => {
        // console.log(r);
        locationsInfo.push(r);
    })
    .on('end', () => {
        // console.log(data);
    })

app.get('/api', cors(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    console.log(query);

    if ("text" in query && query.text != '') {
        var useRegex = (query.regex === "true");
        var queries = [];
        var returnedItems = [];

        //if there is only a single query, turn it into an array of length 1
        if (typeof query.text === 'string') {
            console.log("query is a string");
            queries.push(query.text);
        } else {
            queries = query.text;
        }

        console.log("Queries before accounting for regex:");
        console.log(queries);
        if (!useRegex) {
            console.log("Adding word boundaries");
            queries = queries.map((q) => (
                "\\b" + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b"
            ));
        }

        console.log("Queries:");
        console.log(queries);

        console.log("useRegex = " + useRegex);


        // You can now work with the parsed JSON data
        console.log("query = " + queries);

        for (let volume in jsonData) {
            if ((volume % 100) == 0) console.log("Reading volume " + volume);
            for (let item in jsonData[volume]) {
                var matchesAnyQueries = false;

                for (let currentQuery in queries) {
                    //console.log("currentQuery = " + currentQuery);
                    if (queries[currentQuery].length > 0) {
                        const regex = new RegExp(queries[currentQuery].toLowerCase());
                        const isMatch = regex.test(jsonData[volume][item].text.toLowerCase());
                        if (isMatch) {
                            //console.log("match found");
                            matchesAnyQueries = true;
                        }
                        // else {
                        //     if (jsonData[volume][item].text.includes(queries[currentQuery])) {
                        //         //console.log("match found");
                        //         matchesAnyQueries = true;
                        //     }
                        // }
                    }
                }

                if (matchesAnyQueries) {
                    returnedItems.push(jsonData[volume][item]);
                }
            }


        }
        console.log(returnedItems.length + " items found");
        res.send(returnedItems);
    } else {
        console.log("No query given.");
        res.send([]);
    }
});

app.get('/maps/:number', cors(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;

    var result = [];

    for (var i = 0; i < 119; i++) {
        result.push(
            [
                data[i][params.number],
                locationsInfo[i][3],
                locationsInfo[i][4]
            ]
        );
    }

    console.log(params.number);
    res.send(result);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})