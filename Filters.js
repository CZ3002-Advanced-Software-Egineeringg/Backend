const express = require('express');
var cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const {createClient} = require('@supabase/supabase-js');
const supabaseUrl = 'https://gjzcfefmcwhswjobgdqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemNmZWZtY3doc3dqb2JnZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ0NDI2MDcsImV4cCI6MTk4MDAxODYwN30.jA8bVi1QoIN3R9AJaL8KCpqvCDsE-vf1LZTlmzyvCc4';
const supabase = createClient(supabaseUrl, supabaseKey);

function intersection(setA, setB) {
    const result = new Set();
    for (const elem of setA) {
        if (setB.has(elem)) {
            result.add(elem);
        }
    }
    return Array.from(result);
}
app.post('/api/runQuery', (req, res) => {
    food = req.body.food;
    second_lang = req.body.second_lang;
    service = req.body.service;
    spark = req.body.spark;
    transport = req.body.transport;
    citizenship = req.body.citizenship;
    level = req.body.level;
    max_fee = req.body.max_fee;
    min_fee = req.body.min_fee;
    service = req.body.service;
    
    const Filter1 = async() => {
        const {data} = await supabase.rpc('runfilter', {food:food,
            second_lang: second_lang,
            service: service,
            spark:spark,
            transport:transport});
            return data;
        };
    const Filter2 = async() => {
    const {data} = await supabase.rpc('filterfees', {citizenship:citizenship,
        level: level,
        max_fee: max_fee,
        min_fee: min_fee,
        service: service});
        return data;
    };
    (async () => {
        const data1 = await Filter1();
        const data2 = await Filter2();
        const setA = new Set(data1);
        const setB = new Set(data2);
        console.log(intersection(setA,setB));
        res.send(intersection(setA,setB));
    })();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on: " + port));
/*{food:"Default",
            second_lang: "Tamil",
            spark:"Default",
            transport:"Default",
         citizenship:"SC",
        level: "Nursery (4 yrs old)",
        max_fee: 800,
        min_fee:700,
        service:"Full Day"}*/
