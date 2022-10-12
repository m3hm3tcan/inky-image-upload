const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const port = process.env.PORT || 3001;
app.use(cors());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api/test-api",(req,res)=>{
    res.json({mgs:'welcome'})
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../client/public', 'uploads'),
    filename : function(req,file,cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});



app.post('/upload-image', async(req,res) => {
    try {

        let upload = multer({storage:storage}).single('inkyImage');
        
        upload(req,res, function(err){
            if(!req.file){
                return res.send('Please select an image to upload!');
            }else if(err instanceof multer.MulterError){
                return res.send(err);
            }else if(err){
                return res.send(err);
            }

            res.send(req.file);

        });

    } catch (error) {
        console.log('error happend!',error);
    }
});

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

app.listen(port,()=> 
    console.log(`example app listen at https:localhost:${port}`)
);