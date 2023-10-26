// connecting all modules and defining port
const xml = require('fast-xml-parser')
const fs = require('fs')
const express = require('express')
const app = express()
const port = 8000;

const parser = new xml.XMLParser();
const builder = new xml.XMLBuilder();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

app.get('/', (req, res) => {
    fs.readFile('data.xml', (err, data) => {
        if (err) {
            console.error("An error occured when reading a file: ", err);
            return res.status(500).send("Internal server error: Couldn't read a file");
        }
        const jsonData = parser.parse(data);
        let maxRate = jsonData.exchange.currency[0].rate;

        for (let i = 1; i < jsonData.exchange.currency.length; i++){
            if (jsonData.exchange.currency[i].rate > maxRate){
                maxRate = jsonData.exchange.currency[i].rate;
            }
        }

        const xmlMaxRate = builder.build({
            "data": {
                "max_rate": maxRate
            }
        });
        res.send(xmlMaxRate)
    })
});