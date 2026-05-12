const express = require('express')
var request = require('request')
var cors = require('cors')
const http = require("http");
const querystring = require('node:querystring');
const fs = require('fs');
const { match } = require('assert');
const { parse } = require("csv-parse");
const process = require('process')
const PORT = process.env.PORT || 5000;
const app = express()
const port = PORT;//5000
const path = require('path');

// app.use(cors({origin: 'https://duilinn.github.io/ria-corpus-search.html'}));
// app.use(cors());

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

const lasidLongData = []
fs.createReadStream("public/lasid/lasid_long.csv")
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        // console.log(r);
        lasidLongData.push(r);
    })
    .on('end', () => {
        // console.log(data);
    })

const scotlandLasidIData = []
fs.createReadStream("public/lasid/scotland_lasid_i_data.csv")
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        // console.log(r);
        scotlandLasidIData.push(r);
    })
    .on('end', () => {
        // console.log(data);
    })

const lasidShortIndex = []
fs.createReadStream("public/lasid/lasid_short_index.csv")
    .pipe(parse({ delimiter: '\t' }))
    .on('data', (r) => {
        // console.log(r);
        lasidShortIndex.push(r);
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

const placenameTranscriptions = []
fs.createReadStream("public/transcriptions.csv")
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        // console.log(r);
        placenameTranscriptions.push(r);
    })
    .on('end', () => {
        // console.log(data);
    })

app.get('/transcriptions', cors(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    console.log(params.number);
    res.send(placenameTranscriptions);
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

//lasid vol i
app.get('/maps/:number', cors(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    var result = [];
    let numberOfPointsAll = 124;

    mapColNumber = lasidShortIndex.map(r => stripInitialZeros(r[0])).indexOf(params.number);
    for (var i = 0; i < numberOfPointsAll; i++) {
        pointId = locationsInfo[i][0];

        pointLat = locationsInfo[i][3];
        pointLon = locationsInfo[i][4];
        console.log("point!" + pointId);
        if (["a", "b", "c", "d", "e", "f", "g"].includes(pointId.toLowerCase().trim())) {
            pointData = scotlandLasidIData[mapColNumber + 1][(i - 92) + 3];
        } else {
            pointData = data[i][mapColNumber];
        }
        
        dialectStatus = locationsInfo[i][5].trim();
        result.push(
            {
                "pointData": pointData,
                "lat": pointLat,
                "lon": pointLon,
                "pointId": pointId,
                "dialectStatus": dialectStatus
            }
        );
    }

    console.log(params.number);
    res.send(result);
})

//lasid vols ii-iv
app.get('/mapsLong/:number', cors(), function (req, res) {
    //number = english questionnaire number
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    const numberOfPoints = 96;
    var result = [];
    answerNumber = lasidLongData.map(r => r[0]).indexOf(params.number) - 1;
    console.log(`questionnaire number ${params.number} is question number ${answerNumber}`)
    for (var i = 0; i < numberOfPoints; i++) {
        pointId = lasidLongData[0][i + 3].split("-")[0].slice(6).trim()
        currentLocationInfo = locationsInfo.filter((r) => r[0].toLowerCase() == pointId.toLowerCase())[0];
        pointData = lasidLongData[answerNumber + 1][i + 3];
        if (pointData.length > 0) {
            console.log(`pointData = ${pointData}`);
            result.push(
                {
                    "pointData": lasidLongData[answerNumber + 1][i + 3],
                    "lat": currentLocationInfo[3],
                    "lon": currentLocationInfo[4],
                    "pointId": pointId,
                    "dialectStatus": currentLocationInfo[5].trim()
                }
            );
        }
    }

    console.log("long lasid number: " + params.number);
    res.send(result);
})

app.get('/all-points-info', cors(), function (req, res) {
    //number = english questionnaire number
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    var result = [];
    let numberOfPointsAll = 124;
    for (var i = 0; i < numberOfPointsAll; i++) {
        pointId = locationsInfo[i][0];  
        currentLocationInfo = locationsInfo[i];
        let pointInfoString = `Point ${currentLocationInfo[0]}: ${currentLocationInfo[2]}, ${currentLocationInfo[1]}\nSource: ${currentLocationInfo[7]}`;
        result.push(
            {
                "pointData": pointInfoString,
                "lat": currentLocationInfo[3],
                "lon": currentLocationInfo[4],
                "pointId": pointId,
                "dialectStatus": currentLocationInfo[5].trim()
            }
        );
    }
    res.send(result);
})

app.get('/corpasria', cors(), function (req, res) {
    req.socket.setTimeout(60000);
    res.set('Access-Control-Allow-Origin', 'https://duilinn.github.io');
    res.type("text");
    // res.setHeader("Content-Security-Policy", "style-src-attr 'sha256-pILX+5FGCpLRHvNBgtABIdSMmytrYudGxJBUYXY1t0s=' 'unsafe-hashes';")
    console.log("ria corpus request received");
    const { params, query } = req;
    // res.send("test text");
    var spawn = require("child_process").spawn;
    console.log(require('path').dirname(require.main.filename));
    var process = spawn('python', ["./corpasria.py", query.q]);
    process.stdout.on('data', function (data) {
        console.log(`Data sent: ${data.toString()}`);
        res.send("python script finished");

    });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


// const lasidInfoAll = []
// fs.createReadStream("public/all-lasid-maps-index.csv")
//     .pipe(parse({ delimiter: ',' }))
//     .on('data', (r) => {
//         // console.log(r);
//         lasidInfoAll.push(r);
//     })
//     .on('end', () => {
//         // console.log(data);
//     })

function stripInitialZeros(numStr) {
    if (numStr.length == 0) return num;
    while (numStr[0] == "0" && numStr.length > 1) {
        numStr = numStr.slice(1);
    }
    return numStr
}

app.get('/lasid-info-all', cors(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const { params, query } = req;
    console.log(params.number);
    // lasidInfoAll.plus
    lasidInfoAll = [];

    for (let i = 0; i < lasidShortIndex.length; i++) {
        currentRow = {
            "surveyType": "Short",
            "mapNo": stripInitialZeros(lasidShortIndex[i][0]),
            "volIEquivalent": "—",
            "english": lasidShortIndex[i][1],
            "gaelic": lasidShortIndex[i][2]
        }
        lasidInfoAll.push(currentRow);
    }
    for (let i = 1; i < lasidLongData.length; i++) {
        currentRow = {
            "surveyType": "Long",
            "mapNo": lasidLongData[i][0],
            "volIEquivalent": lasidLongData[i][1],
            "english": lasidLongData[i][2],
            "gaelic": ""
        }
        lasidInfoAll.push(currentRow);
    }
    res.send(lasidInfoAll);
})
