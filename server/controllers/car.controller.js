const express = require("express");
const bodyParser = require("body-parser")

const router = express.Router();

router.use(express.static(__dirname + '/public'));

const car = require("../models/car.model");

const log = require("../models/log.model");

router.use(bodyParser.urlencoded({extended: true}));
// -----.-----.-----.-----.-----.-----.-----.-----.-----.-----

const Transaction = require("../../ethereum/transaction");

// -----.-----.-----.-----.-----.-----.-----.-----.-----.-----

const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;

const user = require("../models/user.model");

router.use(express.json());

let sessions = {};

router
.get("/", (req, res) => {
    res.render("login");
})
.get("/register", (req, res) => {
    res.render("register");
})
.post("/register", (req, res) => {
    const uname = req.body.username;

    bcrypt.genSalt(5, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
            const pass = hashedPassword;
            let newUser = new user({
                username: uname,
                password: pass
            });
            newUser.save().then(() => {
                res.redirect("/api/car/");
            });
        })
    });
})
.post("/login", async (req, res) => {
    let isUser = await user.findOne({username : req.body.username});
    if(isUser) {
        let isValidPass = await bcrypt.compare(req.body.password, isUser.password);
        if(isValidPass) {
            const sessionId = uuid();
            sessions[sessionId] = {username: isUser.username, userId: isUser._id};
            res.set("Set-cookie", `session=${sessionId}`);
            res.redirect("/api/car/buy");
        }
    }
})
.get("/logout", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    delete sessions[sessionId];

    res.set("Set-cookie", `session=`);
    res.redirect("/api/car/");
});

// -----.-----.-----.-----.-----.-----.-----.-----.-----.-----

router
// buy cars
.get("/buy", (req, res) => {

    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession) {
        res.status(401).send("invalid session");
    }

    car.find().then(cars => {
        res.render("index", {
            carsList: cars
        });
    });
})
// sell cars - form
.get("/sell", (req, res) => {

    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession) {
        res.status(401).send("invalid session");
    }

    res.render("index-sell");
})
// buy - sell log
.get("/log", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession) {
        res.status(401).send("invalid session");
    }

    log.find().then(logs => {
        res.render("log", {
            logList: logs
        });
    });
})
// sell cars - form - submit
.post("/sell", (req, res) => {

    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    const ownerId = userSession.userId;
    if(!userSession) {
        res.status(401).send("invalid session");
    }
    let newCar = new car({
        // auth
        ownerId: ownerId,
        // vin
        vin: req.body.vin,
        model: req.body.model,
        price: req.body.price,
        owner: req.body.owner,
        description: req.body.description
    });
    newCar.save();
    res.redirect("/api/car/buy");
})
// view car history - from blockchain
.get("/view-car-history/:id", async (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession) {
        res.status(401).send("invalid session");
    }
    let id = req.params.id;
    car.findById(id).then(car => {
        Transaction.methods.displayAll(car.vin).call().then(history => {
            res.render("view-history", {
                history
            });
        });
    });
})
// view car
.get("/:id", (req, res) => {

    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession) {
        res.status(401).send("invalid session");
    }

    let id = req.params.id;
    car.findById(id).then(car => {
        res.render("view", {
            car
        });
    });
})
// view car - update
.post("/update/:id", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    const ownerId = userSession.userId; // current user id
    
    if(!userSession) {
        res.status(401).send("invalid session");
    }
    let id = req.params.id;
    car.findById(id).then(carDoc => {
        let currCarOwnerId = carDoc.ownerId; // viewing car owner id
        
        let isSame = (JSON.stringify(currCarOwnerId)==JSON.stringify(ownerId));
        if(isSame) {
            car.findByIdAndUpdate(id, {
                // auth
                ownerId: currCarOwnerId,
                // vin
                vin: req.body.vin,
                model: req.body.model,
                price: req.body.price,
                owner: req.body.owner,
                description: req.body.description
            })
            .then(() => {
                res.redirect(`/api/car/${id}`);
            });
        }
    });
})
// view car - delete
.get("/delete/:id", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    const ownerId = userSession.userId; // current user id
    
    if(!userSession) {
        res.status(401).send("invalid session");
    }
    let id = req.params.id;
    car.findById(id).then(carDoc => {
        let currCarOwnerId = carDoc.ownerId; // viewing car owner id
        
        let isSame = (JSON.stringify(currCarOwnerId)==JSON.stringify(ownerId));
        if(isSame) {
            car.findByIdAndDelete(id).then(() => {
                res.redirect("/api/car/buy");
            });
        }
    });
})
// view car - buy
.get("/buy-car/:id", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    const ownerId = userSession.userId; // current user id
    
    if(!userSession) {
        res.status(401).send("invalid session");
    }
    let id = req.params.id;
    car.findById(id).then(carDoc => {
        let currCarOwnerId = carDoc.ownerId; // viewing car owner id
        
        let isSame = (JSON.stringify(currCarOwnerId)==JSON.stringify(ownerId));
        if(!isSame) {
            car.findByIdAndDelete(id).then(() => {
                // add log
                let newLog = new log({
                    sellerId: carDoc.ownerId,
                    buyerId: ownerId,
                    vin: carDoc.vin,
                    model: carDoc.model,
                    price: carDoc.price
                });
                newLog.save();
                res.redirect("/api/car/buy");
            });
        }
    });
});

module.exports = router;