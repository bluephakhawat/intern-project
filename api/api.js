const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");
const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "********",
    database: "postgres"
})

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.listen(3300, () => {
    console.log("Server is now listening at port 3300");
})
client.connect();

// Get Method

app.get("/realtime_db", (req, res) => {
    // console.log('realtime')
    client.query(`SELECT * FROM realtime_db WHERE imei like 'T015%' ORDER BY RANDOM()`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get("/realtime_db/cfv", (req, res) => {
    client.query(`SELECT firmware_current FROM realtime_db
    WHERE firmware_current != '-'
    GROUP BY firmware_current
    HAVING COUNT(firmware_current) > 1
    ORDER BY firmware_current`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get("/realtime_db/:id", (req, res) => {
    client.query(`Select * from realtime_db Where id=${req.params.id}`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

// Global

app.post('/realtime_db/global', (req, res) => {
    // console.log('global passing')
    let filtered_global = req.body.config_global;
    client.query(`Select * from realtime_db Where imei Like '${filtered_global}%' OR mid Like '${filtered_global}%' OR ccid Like '${filtered_global}%' OR vehiclemodel Like '${filtered_global}%' OR acc Like '${filtered_global}%' OR firmware_current Like '${filtered_global}%'`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    })

    client.end;
})

// IMEI

app.post('/realtime_db/imei', (req, res) => {
    // console.log('imei passing')
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// Firmware Current

app.post('/realtime_db/firmware_current', (req, res) => {
    // console.log("firmware_current passing")
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where firmware_current Like '${filtered_firmware_current}%' And imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where firmware_current Like '${filtered_firmware_current}%' And imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where firmware_current Like '${filtered_firmware_current}%' And imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// Mid

app.post('/realtime_db/mid', (req, res) => {
    // console.log("mid passing")
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where mid Like '${filtered_mid}%' And imei Like '${filtered_imei}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where mid Like '${filtered_mid}%' And imei Like '${filtered_imei}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where mid Like '${filtered_mid}%' And imei Like '${filtered_imei}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// CCID

app.post('/realtime_db/ccid', (req, res) => {
    // console.log('ccid passing')
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// Vehiclemodel

app.post('/realtime_db/vehiclemodel', (req, res) => {
    // console.log('vehiclemodel passing')
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// ACC

app.post('/realtime_db/acc', (req, res) => {
    // console.log('acc passing')
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// Status

app.post('/realtime_db/status', (req, res) => {
    // console.log('status passing')
    let filtered_imei = req.body.config_imei;
    let filtered_mid = req.body.config_mid;
    let filtered_ccid = req.body.config_ccid;
    let filtered_vehiclemodel = req.body.config_vehiclemodel;
    let filtered_acc = req.body.config_acc;
    let filtered_firmware_current = req.body.config_firmware_current;
    let filtered_status = req.body.config_status;
    if (filtered_status == 'available') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current = firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else if (filtered_status == 'unavailable') {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%' And firmware_current != firmware_update`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    else {
        client.query(`Select * from realtime_db Where imei Like '${filtered_imei}%' And mid Like '${filtered_mid}%' And ccid Like '${filtered_ccid}%' And vehiclemodel Like '${filtered_vehiclemodel}%' And acc Like '${filtered_acc}%' And firmware_current Like '${filtered_firmware_current}%'`, (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    }
    client.end;
})

// Multiple Filtered IMEI

app.post('/realtime_db/mul_imei', (req, res) => {
    // console.log('multiple imei passing')
    let mul_imei = req.body.config;
    let sc = `Select * from realtime_db Where imei = ANY($1::text[])`
    console.log(mul_imei)
    console.log(sc)
        client.query(sc,[mul_imei], (err, result) => {
            if (!err) {
                res.send(result.rows);
            }
        })
    client.end;
})

// Put Method

app.put('/realtime_db/update', (req, res) => {
    let id = req.body.id;
    let index = id.map(e => {
        return e.id
    })
    console.log("Update Success")
    let version = req.body.version
    console.log("List : ",id)
    console.log("Firmware Version : ",version)
    let updateQuery = `UPDATE realtime_db
                       SET firmware_update = '${version}'
                       WHERE id IN (${index})`

    client.query(updateQuery, (err, result) => {
        if (!err) {
            res.send('Update was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})
