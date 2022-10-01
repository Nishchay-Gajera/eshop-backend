const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


// GET

router.get('/', async (req, res) => {
    //name phone email
    const userList = await User.find().select("-passwordHash")
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList);
});

// POST
router.post("/register", async (req, res) => {
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : bcrypt.hashSync(req.body.passwordHash,10),
        phone : req.body.phone,
        isAdmin : req.body.isAdmin,
        street : req.body.street,
        apartment : req.body.apartment,
        zip : req.body.zip,
        city : req.body.city,
        country : req.body.country,
    });
    user = await user.save();
    if (!user) return res.status(400).send("the category cannot be created");
    res.send(user);
});

router.post("/login",async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send("The user not found");
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign({
            userId: user.id,
            //isAdmin: user.isAdmin,
        },
        secret,{ expiresIn: "1d"}
        
        );
        res.status(200).send({user: user.email, token: token})
    }
    else{
        res.status(400).send("password is wrong")
    }
})

// Update
router.put("/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id, {
            name : req.body.name,
            email : req.body.email,
            passwordHash : req.body.passwordHash,
            phone : req.body.phone,
            isAdmin : req.body.isAdmin,
            street : req.body.street,
            apartment : req.body.apartment,
            zip : req.body.zip,
            city : req.body.city,
            country : req.body.country,
    },
        { new: true }
    );
    if (!user) return res.status(400).send("The user cannot be Found");
    res.send(user);
});

// Delete
router.delete("/:id", (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({ success: true, message: "The user is deleted" });
            }
            else {
                return res.status(500).json({ success: false, message: "User not Found!" });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

module.exports = router;