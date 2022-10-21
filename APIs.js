const express = require('express');
var cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

const {createClient} = require('@supabase/supabase-js');
const supabaseUrl = 'https://gjzcfefmcwhswjobgdqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemNmZWZtY3doc3dqb2JnZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ0NDI2MDcsImV4cCI6MTk4MDAxODYwN30.jA8bVi1QoIN3R9AJaL8KCpqvCDsE-vf1LZTlmzyvCc4';
const supabase = createClient(supabaseUrl, supabaseKey);

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
     service:'outlook365',
     auth: {
     user: 'scared2compile@outlook.com',
     pass: 'CZ2006@2022'
     }
     });
OTPs = new Map();
function generateOTP(email){
     var digits='0123456789';
    let otp='';
    for (let i = 0; i < 4; i++ ) 
    {
     otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
async function sendOTP(email){
     OTPs.set(email,generateOTP(email));
        var mailOptions = {
        from: 'scared2compile@outlook.com',
        to: email,
        subject: 'Your One-Time-Password for preschoolgowhere',
        text: 'Your OTP is '+OTPs.get(email)+'. This OTP is valid for 15 minutes. Please do not share with anyone. If you have logged in again, then do not use this OTP.'
        };
        return new Promise(function (resolve, reject){
            transporter.sendMail(mailOptions, (err, info) => {
             if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                 console.log(`Mail sent successfully!`);
                resolve(info);
             }
            });
        });
}
async function sendinfo(email,data){
        var mailOptions = {
        from: 'scared2compile@outlook.com',
        to: email,
        subject: 'Centre Info',
        text: data
        };
        return new Promise(function (resolve, reject){
            transporter.sendMail(mailOptions, (err, info) => {
             if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                 console.log(`Mail sent successfully!`);
                resolve(info);
             }
            });
        });
}
app.post('/api/signup', (req,res) => {
     password = req.body.password;
     email = req.body.email;
     OTP = req.body.OTP;
     const EmailCheck = async() => {
     const {data} = await supabase
     .from('Accounts')
     .select('email')
     .eq('email',email)

     return data;
     };
     (async () => {
          const result = await EmailCheck();
          if(result.length >= 1)
          {
               console.log("Email already in database");
               res.send("Email already in use");
          }
          else{
               if(OTPs.get(req.body.email) === req.body.OTP){
               const {data} = await supabase.rpc('signup', {email:email,
               password:password});
               console.log("Email not in database");
               res.send("Account succesfully created!");
               }
               else{
                    console.log("OTP doesnt match");
                    res.send("Incorrect OTP. Try again.")
               }
          }
      })();

});
app.post('/api/login', (req,res) => {
     password = req.body.password;
     email = req.body.email;
     const EmailCheck = async() => {
          const {data} = await supabase
          .from('Accounts')
          .select('email')
          .eq('email',email)
     
          return data;
          };
          (async () => {
               const result = await EmailCheck();
               if(result.length === 0)
               {
                    console.log("Email not in database");
                    res.send("Please sign up first.");
               }
               else{
                    const returndata = async() => {
                         const {data} = await supabase.rpc('login', {user_email:email,
                              user_password:password});
                         return data;
                    }
                    const data = await returndata();
                    console.log(data);
                    if(data[0] === email){
                         console.log("Correct password!");
                         res.send("Succesfully logged in!");
                                        }
                    else{
                         console.log("Incorrect password!");
                         res.send("Login Unsuccesful. Incorrect password.");
                    }
               }
           })();
     
});
app.post('/api/updatepassword', (req,res) => {
     password = req.body.password;
     email = req.body.email;
     OTP = req.body.OTP;
     const EmailCheck = async() => {
     const {data} = await supabase
     .from('Accounts')
     .select('email')
     .eq('email',email)

     return data;
     };
     (async () => {
          const result = await EmailCheck();
          if(result.length === 0)
          {
               console.log("Email not in database");
               res.send("Please sign up first.");
          }
          else{
               if(OTPs.get(email) === OTP){
               const {data} = await supabase.rpc('updatepassword', {user_email:email,
               user_password:password});
               console.log("succesful");
               res.send("Sucessfully updated!");
               }
               else{
                    console.log("OTP doesn't match");
                    res.send("Incorrect OTP. Try again.");
               }
          }
      })();

});
app.post('/api/sendOTP', (req,res) => {
          (async () => {
                    const {data} = await sendOTP(req.body.email);
                    console.log(OTPs.get(req.body.email));
                    res.send("OTP has been sent to your email!")
           })();
});
app.post('/api/filteremail', (req, res) => {
     const Filter = async() => {
         const {data} = await supabase.rpc('runmegafilteremail', {
             citizenship:req.body.citizenship,
             distance: req.body.distance,
             food:req.body.food,
             level: req.body.level,
             max_fee: req.body.max_fee,
             min_fee: req.body.min_fee,
             second_lang: req.body.second_lang,
             service: req.body.service,
             spark:req.body.spark,
             transport:req.body.transport,
             type_service: req.body.type_service,
             user_lat: req.body.lat,
             user_long: req.body.long,
               });
          return data;
         };
     (async () => {
         const data = await Filter();
         console.log(data);
         if(req.body.email != ""){
          var emailtext = "";
          for(var element of data){
               var myJSON = JSON.stringify(element);
               emailtext+=myJSON+"\n";
          }
          const {temp} = await sendinfo(req.body.email,emailtext);
         }
         res.send(data);
     })();
 });
 app.post('/api/filter', (req, res) => {
     const Filter = async() => {
         const {data} = await supabase.rpc('runmegafilter', {
             citizenship:req.body.citizenship,
             distance: req.body.distance,
             food:req.body.food,
             level: req.body.level,
             max_fee: req.body.max_fee,
             min_fee: req.body.min_fee,
             second_lang: req.body.second_lang,
             service: req.body.service,
             spark:req.body.spark,
             transport:req.body.transport,
             type_service: req.body.type_service,
             user_lat: req.body.lat,
             user_long: req.body.long,
               });
          return data;
         };
     (async () => {
         const data = await Filter();
         console.log(data);
         res.send(data);
     })();
 });
 
 const port = process.env.PORT || 3000;
 app.listen(port, () => console.log("Listening on: " + port));
 /*{
    "food":"Default",
    "second_lang": "Chinese",
    "spark":"Default",
    "transport":"Default",
    "citizenship":"SC",
    "level": "Kindergarten 1 (5 yrs old)",
    "max_fee": 800,
    "min_fee":700,
    "type_service":"Full Day",
    "service":"Default",
    "lat": 1.3544009033833262,
    "long":103.68816339427896,
    "distance": 0.2,
"email": ""}*/
