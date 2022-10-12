
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
    return result;
}

const Filter1 = async() => {
    const {data} = await supabase.rpc('runfilter', {food:"Default",
        second_lang: "Tamil",
        service: "Default",
        spark:"Default",
        transport:"Default"});
        return data;
    };

const Filter2 = async() => {
    const {data} = await supabase.rpc('filterfees', {citizenship:"SC",
        level: "Nursery (4 yrs old)",
        max_fee: 800,
        min_fee:700,
        service:"Full Day"});
        return data;
    };
    
(async () => {
        const data1 = await Filter1();
        const data2 = await Filter2();
        const setA = new Set(data1);
        const setB = new Set(data2);
        console.log(intersection(setA,setB));
    })();