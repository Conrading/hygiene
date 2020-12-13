const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const cors = require('cors')
app.use(cors())
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true
}));
const fs = require('fs');
const { env } = require('process');

//listening port at 5011
const port = process.env.PORT || 5011;

//read React.js file from build folder
app.use(express.static(path.join(__dirname, 'public')))
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'))
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    })
}


//below is old version for reading/posting JSON 

app.get('/playing', (req, res) => {
    fs.readFile('./storage/storagelist.JSON', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        try {
            const playlist = JSON.parse(jsonString)
            res.json(playlist); // here we send data to front end
            console.log("send the playlist to front") 
        } catch (err) {console.log('Error parsing JSON string:', err)}
    })
})

// if user choose uploading file, update playlist
app.post('/playingVideo', (req, res) => {
    // update new playlist
    const currentDB = JSON.parse(fs.readFileSync("./storage/storagelist.JSON")) // obtain the current DB
    const addedObject = JSON.parse(req.body.playlist) // obtain the current array
    addedObject.push(
        {
            "artist": req.body.artist,
            "source": "storage/" + req.files.file.name,
            "type": "video",
            "title": req.body.title,
            "startPlay": 0,
            "volume": 0.5
        })

    // add two object together, and add "req.body" on the top of "currentDB"
    const randomURL = Math.random() // using random property
    const final = Object.assign(
        {[randomURL]: addedObject}, // generate random url number 
        currentDB
    )
    console.log(final)
    //uploading file
    console.log("Detail: " + req.files); //confirm the file uploaded
    console.log("Now uploading: " + req.files.file.name) 
    let videoFile = req.files.file; //obtain file name
    // store file name
    videoFile.mv(`../public/storage/${req.files.file.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log('file uploaded')
    })

    //update to JSON file, new playlist
    return new Promise(function(resolve, reject) {
        fs.writeFile('./storage/storagelist.JSON', JSON.stringify(final, null, 2), (err) => {
            if (err) reject(err);
            else resolve('Update!!')
        })
    })
    .then(() => {
        console.log('update parameter Sueccessful!!')
        res.redirect('/')
    })
    .catch(err => {console.log('Fail because of ', err)})
})
// if user choose link
app.post('/playingLink', (req, res) => {
    console.log(req.body)
    const currentDB = JSON.parse(fs.readFileSync("./storage/storagelist.JSON")) // obtain the current DB
    console.log("Now we got: " + JSON.stringify(currentDB))

    // add two object together, and add "req.body" on the top of "currentDB"
    const randomURL = Math.random() // using random property
    const final = Object.assign(
        {[randomURL]: JSON.parse(req.body.playlist)}, //generate random url number
        currentDB
    )
    console.log(final)
    //update to JSON file
    return new Promise(function(resolve, reject) {
        fs.writeFile('./storage/storagelist.JSON', JSON.stringify(final, null, 2), (err) => {
            if (err) reject(err);
            else resolve('Update!!')
        })
    console.log('update link Sueccessful!!')
    })
    .then(() => {
        //res.redirect('/')
        // trigger reloading page
        var redir = { redirect: "/" }
        return res.json(redir)
    })
    .catch(err => {console.log('Fail because of ', err)})
})

//setting parameter
app.post("/updateParameter", (req, res) => {
    const waitChangeArray = JSON.parse(req.body.waitChange) // obtain array waiting change
    const unchangeArray = JSON.parse(req.body.unChange) // obtain array unchange
    waitChangeArray.map((items) => {
        items.startPlay = req.body.startPlay
        items.volume = req.body.volume
    })
    console.log("we have update hte parameter setting" + JSON.stringify(waitChangeArray))
    const currentDB = JSON.parse(fs.readFileSync("./storage/storagelist.JSON")) // obtain the current DB
    var urlLastName = Object.keys(currentDB)[0] //store latest collaboration name in var
    currentDB[urlLastName] = waitChangeArray.concat(unchangeArray) //merge two array
    console.log(currentDB)
    //update to JSON file
    return new Promise(function(resolve, reject) {
        fs.writeFile('./storage/storagelist.JSON', JSON.stringify(currentDB, null, 2), (err) => {
            if (err) reject(err);
            else resolve('Update!!')
        })
    console.log('update parameter Sueccessful!!')
    })
    .then(() => {
        //res.redirect('/')
        // trigger reloading page
        var redir = { redirect: "/" }
        return res.json(redir)
    })
    .catch(err => {console.log('Fail because of ', err)})
})


app.listen(port, () => {console.log(`Server is running on port: ${port}`)})
