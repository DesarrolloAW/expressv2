const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/stations', function (req, res) {
    console.log("[" + new Date() + "]" + " GET " + req.url);
    var options = {
        method: 'GET',
        url: 'https://dawproject-f367.restdb.io/rest/stations',
        headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': 'c15b4e373717132faa54e20a1ba1cad6ca8d9'
        }
    };

    request(options, function (error, response, body) {
        res.send(body);
    });
});

app.post("/station", function (req, res) {
    console.log("[" + new Date() + "]" + " POST " + req.url);
    var station = new Object();
    if (req.body.name && req.body.province && req.body.canton
        && req.body.parish && req.body.lat && req.body.lng) {
        station.name = req.body.name;
        station.province = req.body.province;
        station.canton = req.body.canton;
        station.parish = req.body.parish;
        station.coord = new Object();
        station.coord.lng = req.body.lng;
        station.coord.lat = req.body.lat;
        station.obs = 0;
        station.last_obs = "not data";
        var options = {
            method: 'POST',
            url: 'https://dawproject-f367.restdb.io/rest/stations',
            headers:
            {
                'cache-control': 'no-cache',
                'x-apikey': 'c15b4e373717132faa54e20a1ba1cad6ca8d9',
                'content-type': 'application/json'
            },
            body: station,
            json: true
        };

        request(options, function (error, response, body) {
            if (error) res.send(error);
            res.send("Operación exitosa");
        });
    } else
        res.send("Parámetros incorrectos");

});

app.put("/station/:id", function (req, res) {
    console.log("[" + new Date() + "]" + " PUT " + req.url);
    const { name, province, canton, parish, lat, lng } = req.body;
    var coord = new Object();
    if (lat) {
        coord.lat = lat;
        delete req.body.lat;
    }
    if (lng) {
        coord.lng = lng;
        delete req.body.lng;
    }

    if (coord.lat || coord.lng) {
        req.body.coord = coord;
    }

    var options = {
        method: 'PUT',
        url: 'https://dawproject-f367.restdb.io/rest/stations/' + req.params.id,
        headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': 'c15b4e373717132faa54e20a1ba1cad6ca8d9',
            'content-type': 'application/json'
        },
        body: { ...req.body },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw res.send(error);
        res.send("Operación exitosa");
    });
});

app.delete("/station/:id", function (req, res) {
    console.log("[" + new Date() + "]" + " DELETE " + req.url);
    var options = {
        method: 'DELETE',
        url: 'https://dawproject-f367.restdb.io/rest/stations/' + req.params.id,
        headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': 'c15b4e373717132faa54e20a1ba1cad6ca8d9',
            'content-type': 'application/json'
        }
    };

    request(options, function (error, response, body) {
        if (error) res.send(error);

        res.send("Operacion exitosa");
    });
});

var PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("Server listen in port " + PORT);
});