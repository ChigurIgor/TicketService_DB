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

let timeCicle=0;
let timeout=60000;

// setInterval(function() {
//     console.log('setInterval');
//     timeCicle++;
//     console.log(timeCicle);
//
//     var timeInMs = Date.now();
//     console.log(timeInMs);
//
//     searchReserve(timeInMs);
//
// }, timeout);

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
    // req.on('data', chunk => {
    //     body += chunk.toString(); // convert Buffer to string
    // });
    // req.on('end', () => {
    //     var post = qs.parse(body);
    //
    //     console.log(body);
    //     id=post.id;
    //
    //     getEvents(id,res);
    // });
    getEvents(id,res);

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

app.post('/geteventbyid',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let id="";

    let body = '';
    // req.on('data', chunk => {
    //     body += chunk.toString(); // convert Buffer to string
    // });
    // req.on('end', () => {
    //     var post = qs.parse(body);
    //
    //     console.log(body);
    //     id=post.id;
    //
    //     getEvents(id,res);
    // });

    var post = req.body;
    id=post.id;
    getEventById(id,res);

});

function getEventById(id,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {
                let o_id = new mongo.ObjectID(id);

                await db.collection("events").find({ "_id" : o_id }).toArray(function (err, documents) {
                    // console.log(documents);

                    res.end(JSON.stringify(documents));


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}





// -------------------------------------------------------- events --------------------------------------------------------------------------



// -------------------------------------------------------- users --------------------------------------------------------------------------


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

    var post = req.body;
    console.log(post);
    // req.on('data', chunk => {
    //     console.log("req.on");
    //     body += chunk.toString(); // convert Buffer to string
    // });
    // req.on('end', () => {
    //     console.log("req.end");

        // var post = qs.parse(body);

        // console.log(body);
        login=post.login;
        password=post.password;

        loginFun(login,password,res);
    // });

});

function loginFun(login,password,res){

    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {

                console.log(login);
                console.log(password);
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

// -------------------------------------------------------- users --------------------------------------------------------------------------

// -------------------------------------------------------- orders --------------------------------------------------------------------------



app.post('/orderadd',(req,res)=>{
    console.log("We are in orderadd");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', "*");
    let eventId="";
    let uid="";
    let places=[];

    let body = '';
    // console.log(req);
    // console.log(req.toString());
    // console.log("req.data.body");
    // console.log(req.body);

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
    eventId=post.id;
    uid=post.uid;
    places=post.places;


    orderAdd(eventId, uid, places, res);
    // res.end(JSON.stringify({ msg: "OK" }));
    // });
// console.log(req.body.gender);

});

function orderAdd(eventId, uid, places, res) {

    console.log("We are in func orderadd");


    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {
                let o_id = new mongo.ObjectID(eventId);
                console.log('o_id');
                console.log(o_id);

                await db.collection("events").find({ "_id" : o_id }).toArray(function (err, documents) {
                    // console.log(documents);

                    // res.end(JSON.stringify(documents));
                    eventSetSeats(documents, places, res, uid, o_id);

                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });


}

function eventSetSeats(documents, places, res, uid, o_id){
    let event=documents[0];
    console.log('event seats // uid');
    console.log(uid);
    // console.log('event.places');
    // console.log(event.places);
    // console.log('event.places.JSON.PARSE');
    // console.log(JSON.parse(event.places));
    let eventPlacesOBJ=JSON.parse(event.places);

    for(let place of places){
        // console.log(place);
        for(let eventPlace of eventPlacesOBJ){
            // console.log(eventPlace);

            if(place.row === eventPlace.row && place.seat === eventPlace.seat){
                if(eventPlace.status==="reserved" && eventPlace.uid==uid[0]) {
                    eventPlace.status = 'sold';
                    eventPlace.uid = uid[0];
                    eventPlace.time = Date.now();
                }
                else {
                    res.end(JSON.stringify({ msg: "These places are no longer available" }));
                }
            }
        }
    }

    // console.log(eventPlacesOBJ);

    let eventPlaces=JSON.stringify(eventPlacesOBJ);




    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {



            await db.collection("events").updateOne({"_id" : o_id }, { $set: {places: eventPlaces } }, function(err, documents) {
                if (err) throw err;
                res.end(JSON.stringify({ msg: "OK" }));
            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }


    });

                // res.end(JSON.stringify({ msg: "OK" }));

}



// -------------------------------------------------------- orders --------------------------------------------------------------------------



// -------------------------------------------------------- reserve ------------------------------------------------------------------------

app.post('/reserveadd',(req,res)=>{
    console.log("We are in reserveadd");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', "*");
    let eventId="";
    let uid="";
    let places=[];

    let body = '';
    // console.log(req);
    // console.log(req.toString());
    // console.log("req.data.body");
    // console.log(req.body);

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
    eventId=post.id;
    uid=post.uid;
    places=post.places;


    reserveAdd(eventId, uid, places, res);
    // res.end(JSON.stringify({ msg: "OK" }));
    // });
// console.log(req.body.gender);

});

function reserveAdd(eventId, uid, places, res) {

    console.log("We are in func orderadd");


    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {
                let o_id = new mongo.ObjectID(eventId);
                console.log('o_id');
                console.log(o_id);

                await db.collection("events").find({ "_id" : o_id }).toArray(function (err, documents) {
                    // console.log(documents);

                    // res.end(JSON.stringify(documents));
                    reserveSetSeats(documents, places, res, uid, o_id);

                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });


}

function reserveSetSeats(documents, places, res, uid, o_id){
    let event=documents[0];
    console.log('event seats // uid');
    console.log(uid);
    console.log('places');
    console.log(places);
    // console.log('event.places.JSON.PARSE');
    // console.log(JSON.parse(event.places));
    let eventPlacesOBJ=JSON.parse(event.places);

    for(let place of places){
        console.log(place);
        for(let eventPlace of eventPlacesOBJ){
            // console.log(eventPlace);

            if(place.row === eventPlace.row && place.seat === eventPlace.seat){
                eventPlace.status='reserved';
                eventPlace.uid=uid[0];
                console.log(uid[0]);
                eventPlace.time=Date.now();
            }
        }
    }

    // console.log(eventPlacesOBJ);

    let eventPlaces=JSON.stringify(eventPlacesOBJ);




    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var answer = "0";
        // var allProductsArray = db.collection("items").find().toArray();
        try {



            await db.collection("events").updateOne({"_id" : o_id }, { $set: {places: eventPlaces } }, function(err, documents) {
                if (err) throw err;
                res.end(JSON.stringify({ msg: "OK" }));
            });
        } finally {
            if (db) mongoClientPromise.close();
            console.log("client.close()");

        }


    });

    // res.end(JSON.stringify({ msg: "OK" }));

}

function searchReserve(time){
    var mongoClientPromise = mongoClient.connect(async function (err, client) {
        if (err){
            console.error('An error occurred connecting to MongoDB: ',err);
        }else {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("phones").find().toArray();
            try {


                await db.collection("events").find().toArray(function (err, documents) {
                    // console.log(documents);

                    searchReservedSeats(documents, time);


                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }
        }

    });
}


function searchReservedSeats(events, time){
    console.log('searchReservedSeats');
    let timeDifference=600000;

    for(let event of events){
        let seats =JSON.parse(event.places);
            for(let seat of seats){
                if(seat.status == "reserved" && (seat.time+timeDifference)<time){
                    seat.status='free';
                    seat.time ='';
                    seat.uid ='';
                    console.log(seat.row);
                    console.log(seat.seat);

                }
            }
         let eventPlaces=JSON.stringify(seats);
        let o_id = new mongo.ObjectID(event._id);
            console.log('o_id= '+o_id);

        var mongoClientPromise = mongoClient.connect(async function (err, client) {
            const db = client.db(dbName);
            var answer = "0";
            // var allProductsArray = db.collection("items").find().toArray();
            try {



                await db.collection("events").updateOne({"_id" : o_id }, { $set: {places: eventPlaces } }, function(err, documents) {
                    if (err) throw err;
                });
            } finally {
                if (db) mongoClientPromise.close();
                console.log("client.close()");

            }


        });





    }



}

// -------------------------------------------------------- reserve ------------------------------------------------------------------------





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

