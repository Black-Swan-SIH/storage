import express from 'express'
import cors from 'cors'
import { candidateImageUpload, ensureFolderExists, expertImageUpload, resumeUpload } from './multer.js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config();
const app = express()
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

//Sorry not following RESTful conventions, no time for it right now, maybe later?

// upload resume after parsing
app.post('/upload/resume', resumeUpload.single('file'), (req, res) => {
    console.log(req.file, "resume")
    res.send("File uploaded")
})

// delete all experts' images
app.delete('/delete/image/expert', (req, res) => {
    fs.promises.rmdir(`./public/images/expert`, { recursive: true }).then(() => {
        console.log("Expert images folder deleted")
    }).catch(err => {
        console.log(err)
    })
})

// delete all candidates' images
app.delete('/delete/image/candidate', (req, res) => {
    fs.promises.rmdir(`./public/images/candidate`, { recursive: true }).then(() => {
        console.log("Candidate images folder deleted")
    }).catch(err => {
        console.log(err)
    })
})

// delete image of a particular expert
app.delete('/delete/expert/:imageName', (req, res) => {
    const { imageName } = req.params
    fs.promises.unlink(`./public/images/expert/${imageName}`).then(() => {
        console.log("Image deleted")
    }).catch(err => {
        console.log(err)
    })
})

// delete image of a particular candidate
app.delete('/delete/candidate/:imageName', (req, res) => {
    const { imageName } = req.params
    fs.promises.unlink(`./public/images/candidate/${imageName}`).then(() => {
        console.log("Image deleted")
    }).catch(err => {
        console.log(err)
    })
})

// upload image of a candidate
app.post('/upload/image/candidate', candidateImageUpload.single('image'), (req, res) => {
    console.log(req.file), "candidate image"
    res.send("Image uploaded")
})

// upload image of an expert
app.post('/upload/image/expert', expertImageUpload.single('image'), (req, res) => {
    console.log(req.file), "candidate image"
    res.send("Image uploaded")
})

// move resume from temp folder to it's destined location
app.post('/upload/resume/changename', (req, res) => {
    console.log(req.body)
    const {person, oldResumeName ,newResumeName} = req.body
    let oldPath, newPath, newFolder

    if(person === 'candidate'){
        oldPath = `./public/resumes/temp/${oldResumeName}`
        newFolder = `./public/resumes/candidate`
        newPath = `./public/resumes/candidate/${newResumeName}`
        console.log(oldPath, newPath)
    }
    else if(person === 'expert'){
        oldPath = `./public/resumes/temp/${oldResumeName}`
        newFolder = `./public/resumes/expert`
        newPath = `./public/resumes/expert/${newResumeName}`
    }

    try{
        ensureFolderExists(newFolder)
        fs.promises.rename(oldPath, newPath, (err) => {
            if(err){
                console.log(err)
            }
            console.log("File renamed")
        })
    }catch(err){
        console.log(err)
    }
    res.send("File renamed")
})

// delete resume of an expert
app.delete('/resume/expert', (req, res)=>{
    fs.promises.rmdir(`./public/resumes/expert`, { recursive: true }).then(() => {
        console.log("Expert resumes folder deleted")
    }).catch(err => {
        console.log(err)
    })
})

// delete resume of a candidate
app.delete('/resume/candidate', (req, res)=>{
    fs.promises.rmdir(`./public/resumes/candidate`, { recursive: true }).then(() => {
        console.log("Candidate resumes folder deleted")
    }).catch(err => {
        console.log(err)
    })
})

app.get('/', (req, res) => {
    res.send("SIH CDN")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})