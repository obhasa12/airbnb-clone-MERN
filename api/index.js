const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Place = require('./models/place')
const CookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(8); 
const jwtSecret = "g2o1i3g98dgsaudgdsaljkhj3@d@ewewq**1"

app.use(express.json());
app.use(CookieParser());
app.use('/upload', express.static(__dirname + '/upload'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok')
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(userDoc)
    }
    catch(e){
        res.status(422).json(e)
    }
});

app.post('/login', async (req, res) => {
    const {email, password}= req.body;
    const userDoc = await User.findOne({email})
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        }else{
            res.status(422).json("not ok");
        }
    }else{
        res.json("not found")
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    }else{
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName ='photos-' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/upload/' + newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({dest: 'upload/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const { files } = req;
    const uploadedFiles = [];
    for(let file of files){
        const { path, originalname } = file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('upload',''))
    }
    res.json(uploadedFiles)
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {title, address, 
        addedPhotos: photos, description, 
        perks, extraInfo, checkIn, 
        checkOut, maxGuests, price
    } = req.body;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
            if(err) throw err;
            const placeDoc = await Place.create({
                owner: userData.id,
                title, address, 
                photos, description, 
                perks, extraInfo, checkIn, 
                checkOut, maxGuests, price
            })
            res.json(placeDoc)
        })

    };
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
        const { id } = userData;
        const placeData = await Place.find({owner: id})
        
        res.json(placeData);
    })
})

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    const placeData = await Place.findById(id);
    res.json(placeData);
});

app.put('/places', async(req, res) => {
    const { token } = req.cookies;
    const {id, title, address, 
        addedPhotos: photos, description, 
        perks, extraInfo, checkIn, 
        checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
        const placeDoc = await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title, address, 
                photos, description, 
                perks, extraInfo, checkIn, 
                checkOut, maxGuests, price
            });
            await placeDoc.save();
            res.json('ok');
        }
    })
} );

app.get('/places', async(req, res) => {
    const placeData = await Place.find();
    res.json(placeData);
});

app.listen(4000, () => console.log("LISTEN PORT 4000"));