const express = require("express");
const bodyParser= require("body-parser");
var qs = require('querystring');
var mongo = require('mongodb');

const PORT = process.env.PORT || 5000;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://madcat:masterminde+1@ds247827.mlab.com:47827/ticketservice";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
// создаем объект MongoClient и передаем ему строку подключения
const dbName="ticketservice";




var app=express();

var cors = require('cors');

app.use(cors());


app.get('/',(req,res)=>res.send("Hi"));


app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.use(express.bodyParser());
app.use(bodyParser.json());



// -------------------------------------------------------- events --------------------------------------------------------------------------



app.post('/eventadd',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let date="";
    let description="";
    let eventName="";
    let eventStar="";
    let hall="";
    let imgMain="";
    let imgPreview="";
    let places=[];
    let priceEnd=0;
    let priceStart=0;
    let ticketsAvailable=0;
    let category="";
    // let place={};
    // place.category="";
    // place.price=0;
    // place.row=0;
    // place.seat=0;
    // var obj=JSON.stringify(works);
    // works=obj;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        date=post.date;
        description=post.description;
        eventName=post.eventName;
        eventStar=post.eventStar;
        hall=post.hall;
        imgMain=post.imgMain;
        imgPreview=post.imgPreview;
        places=post.places;
        priceEnd=post.priceEnd;
        priceStart=post.priceStart;
        ticketsAvailable=post.ticketsAvailable;
        category=post.category;

        eventAdd(date,description,eventName,eventStar,hall,imgMain,imgPreview,places,priceEnd,priceStart,ticketsAvailable,category);
        res.end(JSON.stringify({ msg: "OK" }));
    });

});

function eventAdd(date,description,eventName,eventStar,hall,imgMain,imgPreview,places,priceEnd,priceStart,ticketsAvailable,category) {

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);

        const collection = db.collection("events");
        let event = {
                    category:category,
                    date: date,
                    description:description,
                    eventName:eventName,
                    eventStar:eventStar,
                    hall:hall,
                    imgMain:imgMain,
                    imgPreview:imgPreview,
                    places:places,
                    priceEnd:priceEnd,
                    priceStart:priceStart,
                    ticketsAvailable:ticketsAvailable};
        try {
            await collection.insertOne(event, function (err, result) {

                if (err) {
                    return console.log(err);
                }
                console.log(result.ops);

            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");
            res.end(JSON.stringify({ msg: "OK" }));
        }
    });


}

app.post('/getevents',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;

        getEvents(id,res);
    });

});

function getEvents(id,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                await db.collection("events").find().toArray(function (err, documents) {
                    console.log(documents);

                    res.end(JSON.stringify(documents));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}




// -------------------------------------------------------- users --------------------------------------------------------------------------


// -------------------------------------------------------- events --------------------------------------------------------------------------



app.post('/registration',(req,res)=>{
    console.log("We are in registration");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', "*");
    let gender="";
    let name="";
    let surname="";
    let company="";
    let street="";
    let house="";
    let addinfo="";
    let postcode="";
    let city="";
    let country="";
    let email="";
    let password="";
    let phone="";
    let addphone="";

    let body = '';
    // console.log(req);
    // console.log(req.toString());
    console.log("req.data.body");
    console.log(req.body);

    // req.on('data', chunk => {
    //     body += chunk.toString(); // convert Buffer to string
    //     console.log(body);
    //     console.log(chunk);
    // });
    // body= req.body;
    // req.on('end', () => {
        var post = req.body;
        // var post = qs.parse(body);
    //     console.log("req.end");
    //
    //     console.log(body);
        gender=post.gender;
        name=post.name;
        surname=post.surname;
        company=post.company;
        street=post.street;
        house=post.house;
        addinfo=post.addinfo;
        postcode=post.postcode;
        city=post.city;
        country=post.country;
        email=post.email;
        password=post.password;
        phone=post.phone;
        addphone=post.addphone;

        userAdd(gender,name,surname,company,street,house,addinfo,postcode,city,country,email,password,phone,addphone);
        res.end(JSON.stringify({ msg: "OK" }));
    // });
// console.log(req.body.gender);

});

function userAdd(gender,name,surname,company,street,house,addinfo,postcode,city,country,email,password,phone,addphone) {

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);

        const collection = db.collection("users");
        let user = {
            gender:gender,
            name: name,
            surname:surname,
            company:company,
            street:street,
            house:house,
            addinfo:addinfo,
            postcode:postcode,
            city:city,
            country:country,
            email:email,
            password:password,
            phone:phone,
            addphone:addphone};
        try {
            await collection.insertOne(user, function (err, result) {

                if (err) {
                    return console.log(err);
                }
                console.log(result.ops);

            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");
            res.end(JSON.stringify({ msg: "OK" }));
        }
    });


}

app.post('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let login="";
    let password="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        login=post.login;
        password=post.password;

        login(login,password,res);
    });

});

function login(login,password,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                await db.collection("users").find({email: login,password: password}).toArray(function (err, documents) {
                    console.log(documents);

                    res.end(JSON.stringify(documents));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}




// -------------------------------------------------------- old --------------------------------------------------------------------------
// -------------------------------------------------------- old --------------------------------------------------------------------------















// -------------------------------------------------------- phones --------------------------------------------------------------------------

app.post('/getmakes',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;

        getMakes(id,res);
    });

});

function getMakes(id,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db("phoneservice");
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                await db.collection("phones").find().toArray(function (err, documents) {
                    console.log(documents);
                    let makesArr=documents.map(({ make }) => make);

                    console.log(makesArr);

                    var arrayUnique = function (arr) {
                        return arr.filter(function(item, index){
                            return arr.indexOf(item) >= index;
                        });
                    };
                    var makesUnique = arrayUnique(makesArr);
                    makesUnique.sort();

                    res.end(JSON.stringify(makesUnique));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}

app.post('/gettypes',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";
    let make="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;
        make=post.make;

        getTypes(id,make,res);
    });

});

function getTypes(id,make,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db("phoneservice");
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                    await db.collection("phones").find({make: make}).toArray(function (err, documents) {

                        console.log(documents);
                    let typesArr=documents.map(({ type }) => type);

                    console.log(typesArr);

                    var arrayUnique = function (arr) {
                        return arr.filter(function(item, index){
                            return arr.indexOf(item) >= index;
                        });
                    };
                    var typesUnique = arrayUnique(typesArr);
                    typesUnique.sort();

                    res.end(JSON.stringify(typesUnique));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}




app.post('/getmodels',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let make="";
    let type="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        make=post.make;
        type=post.type;

        getModels(make,type,res);
    });

});

function getModels(make,type,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db("phoneservice");
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                await db.collection("phones").find({make: make,type: type}).toArray(function (err, documents) {
                    console.log(documents);
                    let namesArr=documents.map(({ name }) => name);

                    res.end(JSON.stringify(namesArr));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}


app.post('/getmodel',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let name="";
    let make="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        name=post.name;
        make=post.make;

        getModel(name,make,res);
    });

});


function getModel(name,make,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {


            await db.collection("phones").find({name: name,make:make}).toArray(function (err, documents) {
                console.log(documents);

                res.end(JSON.stringify(documents));


            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }

    });
}




app.post('/modeladd',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let name="";
    let make="";
    let type="";
    let works=["1","2","3","4","5","6","7","8","9","10"];
    var obj=JSON.stringify(works);
    works=obj;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        make=post.make;
        name=post.name;
        type=post.type;

        modelAdd(make,name,type,works);
        res.end(JSON.stringify({ msg: "OK" }));
    });

});

function modelAdd(make,name,type,works) {

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");

        const collection = db.collection("phones");
        let msg = {make: make,name:name, type:type, works:works};
        try {
            await collection.insertOne(msg, function (err, result) {

                if (err) {
                    return console.log(err);
                }
                console.log(result.ops);

            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");
            res.end(JSON.stringify({ msg: "OK" }));


        }
    });


}


app.post('/modeldelete',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;

        modelDelete(id,res);
    });

});

function modelDelete(id,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {

            let o_id = new mongo.ObjectID(id);

            await db.collection("phones").deleteOne({"_id" : o_id },function (err, documents) {
                if (err) throw err;
                res.end(JSON.stringify({ msg: "OK" }));
            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }


    });
}


app.post('/modelsetworks',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";
    let works=[];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;
        works=post.works;

        modelSetWorks(id,works,res);
    });

});

function modelSetWorks(id,works,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {

            let o_id = new mongo.ObjectID(id);

            await db.collection("phones").updateOne({"_id" : o_id }, { $set: {works: works } }, function(err, documents) {
                if (err) throw err;
                res.end(JSON.stringify({ msg: "OK" }));
            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }


    });
}




// -------------------------------------------------------- orders --------------------------------------------------------------------------


app.post('/orderadd',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let email="";
    let phone ="";
    let id="";
    let works="";
    let make="";
    let type="";
    let model="";
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        email=post.email;
        phone=post.phone;
        id=post.id;
        works=post.works;
        make=post.make;
        type=post.type;
        model=post.model;
        orderAdd(email,phone,id,works,make,type,model );
        res.end(JSON.stringify({ msg: "OK" }));
    });

});

app.post('/ordergetall',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;

        orederGetAll(id,res);
    });

});

app.post('/orderdelete',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id=post.id;

        orederDelete(id,res);
    });

});


function orderAdd(email,phone,id,works,make,type,model) {




    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");

        const collection = db.collection("orders");
        let msg = {email: email, phone: phone, id: id, works: works, make:make, type: type, model:model};
        try {
            await collection.insertOne(msg, function (err, result) {

                if (err) {
                    return console.log(err);
                }
                console.log(result.ops);

            });
        } finally {
            sendEmail(email,phone,id,works,make,type,model);
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }
    });


    function sendEmail(email,phone,id,works,make,type,model) {
        console.log("SendEmail");
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'maabada.shaikevich@gmail.com',
                pass: 'geulaNow770'
            }
        });
        // var arr=JSON.parse(cart);
        // console.log("cart: "+arr);
        arrObj = {};
        // arrObj = JSON.parse(cart);
        console.log();
        console.log();
        console.log();

        // console.log(arrObj);
        // console.log("keys: "+arrObj.length);
        // console.log("0: "+JSON.parse(arrObj[0]).id);
        // console.log("1: "+JSON.parse(arrObj[1]).id);
        i=0;
        var myhtml=
            '<h1>New order info</h1>' +
            '<p>ID: '+id+'</p>'+
            '<p>Customer\'s email: '+email+'</p>'+
            '<p>Customer\'s phone: '+phone+'</p>'+
            '<p>Make: '+make+'</p>'+
            '<p>Type: '+type+'</p>'+
            '<p>Model: '+model+'</p>'+
            '<p>Works: '+works+'</p>'+
            '<ol>'
        ;
        // var fullPrice=0;

        // for(i=0;i<arrObj.length;i+=1){
        //     var itemPrice=0;
        //     var itemId=JSON.parse(arrObj[i]).id;
        //     var itemCount=JSON.parse(arrObj[i]).count;
        //     var itemName=JSON.parse(arrObj[i]).nameItem;
        //     itemPrice=JSON.parse(arrObj[i]).price;
        //     // var item =itemGetByIdForEmail(itemId);
        //
        //
        //     console.log("itemPrice: "+itemPrice);
        //
        //     fullPrice=fullPrice+(parseInt(itemPrice)*parseInt(itemCount));
        //
        //     var itemHtml=
        //         '<li>'+
        //         // '<p>'+itemId+'</p>'+
        //         '<p>Item: '+itemName+'</p>'+
        //         '<p>Amount: '+itemCount+'</p>'+
        //         '<p>ItemPrice: '+itemPrice+'</p>'+
        //         '</li>';
        //
        //     myhtml=myhtml+itemHtml;
        // }
        console.log();
        console.log();
        console.log();
        // console.log("fullPrice: "+fullPrice);



        // myhtml=myhtml+'</ol>'+'<p>Full order pice: '+fullPrice+'</p>';





        var mailOptions = {
            from: 'maabada.shaikevich@gmail.com',
            to: 'maabada.shaikevich@gmail.com',
            subject: 'New order from store!',
            text: 'New order from store!',
            html: myhtml

        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Email sent error: '+error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }




}

function orederGetAll(id,res){

    var mongoClientPromise =  mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        try {


            await db.collection("orders").find().toArray(function (err, documents) {
                console.log(documents);

                res.end(JSON.stringify(documents));


            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }

    });
}

function orederDelete(id,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {

            let o_id = new mongo.ObjectID(id);

            await db.collection("orders").deleteOne({"_id" : o_id },function (err, documents) {
                if (err) throw err;
                res.end(JSON.stringify({ msg: "OK" }));
            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }


    });
}


// -------------------------------------------------------- reviews --------------------------------------------------------------------------


app.post('/reviewadd',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let name="";
    let description ="";
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        name=post.name;
        description=post.description;
        reviewAdd(name,description );
        res.end(JSON.stringify({ msg: "OK" }));
    });

});



function reviewAdd(name,description ) {


    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");

        const collection = db.collection("reviews");
        let msg = {name: name, description: description};
        try {
            await collection.insertOne(msg, function (err, result) {

                if (err) {
                    return console.log(err);
                }
                console.log(result.ops);

            });
        } finally {
            // sendEmail(address,date,time,email, name,phone,msgtxt,cart,delTime);
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }
    });


}

app.post('/reviewgetall',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id = "";

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var post = qs.parse(body);

        console.log(body);
        id = post.id;

        reviewGetAll(id, res);
    });

});


function reviewGetAll(id, res) {

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db("phoneservice");
        var answer = "0";
        try {


            await db.collection("reviews").find().toArray(function (err, documents) {
                console.log(documents);

                res.end(JSON.stringify(documents));


            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }

    });
}

