var mysql = require('mysql2');
const http = require("http");
const querystring = require('node:querystring');
const PORT = process.env.PORT || 5000;
const sqlPassword = require("./sqlPassword");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlPassword,
    database: "duchas_test"
});

var query = "iomarca";

con.connect(function (err) {
    if (err) throw err;


    const server = http.createServer(async (req, res) => {
        const headers = {
            'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
            "Content-Type": "application/json"
            /** add other headers as per requirement */
        };

        //set the request route
        if (req.method === "GET") {
            var queries = querystring.parse(req.url.slice(5,));

            var sql = "SELECT * FROM bnas_test";

            for (let query in queries) {
                // if (query=="title") sql += " title = \"" + ("title" in queries ? queries.title : "*" + "\"";
                // if ("language" in queries) sql += " AND language = \"" + queries.language + "\"";
                // if ("lat" in queries) sql += " AND lat = \"" + queries.lat + "\"";
                // if ("lon" in queries) sql += " AND lon = " + queries.lon + "\"";
                // if ("url" in queries) sql += " AND url = \"" + queries.url + "\"";
                if (query == "text") {
                    if (queries.text.length == 1) {
                        sql += " WHERE text LIKE \"%" + queries.text + "%\"";
                    } else {
                        sql += " WHERE text LIKE \"%" + queries.text[0] + "%\"";
                        for (var i = 1; i < queries.text.length; i++) {
                            sql += " OR text LIKE \"%" + queries.text[i] + "%\"";
                        }
                    }
                }
            }
            //console.log(queries);
            sql += ";";

            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                //console.log("sql: " + sql);
                res.writeHead(200, headers);
                res.write("");
                res.end(JSON.stringify(result));
            });
        }

        // If no route present
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Route not found" }));
        }
    });

    // 

    server.listen(PORT, () => {
        console.log(`server started on port: ${PORT}`);
    });

});

