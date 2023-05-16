const express = require('express')
var request = require('request')
var cors = require('cors')
const http = require("http");
const querystring = require('node:querystring');
const fs = require('fs');
const { match } = require('assert');
const PORT = process.env.PORT || 5000;
const app = express()
const port = 5000

const filePath = 'public/volumes_simplified_full.json';
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

app.get('/api', cors(), function (req, res) {
    const { params, query } = req;

    var queries = query.text;
    var returnedItems = [];

    if (typeof queries === 'string') {
        console.log("query is a string");
        queries = [query.text];
    }

    console.log("Queries:");
    console.log(queries[0]);


    // You can now work with the parsed JSON data
    console.log("query = " + queries);
    for (let volume in jsonData) {
        if ((volume % 100) == 0) console.log("Reading volume " + volume);
        for (let item in jsonData[volume]) {
            var matchesAnyQueries = false;

            for (let query in queries) {

                if (jsonData[volume][item].text.includes(queries[query])) {
                    matchesAnyQueries = true;
                }
            }

            if (matchesAnyQueries) {
                returnedItems.push(jsonData[volume][item]);
            }
        }
    }
    console.log(returnedItems.length + " items found");
    res.send(returnedItems);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})