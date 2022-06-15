import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/list-files', (req, res) => {
    const base = req.body.base || path.join(__dirname,'./files');
    const filterDate = req.body.filterDate || '2022-06-01';
    if (fs.existsSync(base)) {
        const filesAndDirs = fs.readdirSync(base);
        const dirs = filesAndDirs.filter(file => {
            if (fs.existsSync(path.join(base, file))){
                return fs.statSync(path.join(base, file))?.isDirectory()
            }
            
        });
        const files = filesAndDirs.filter(file => {
            if (fs.existsSync(path.join(base, file))){
                return fs.statSync(path.join(base, file))?.isFile()
            }
      
        });
    
        const filteredFilesAfterFilterDate = files.filter(file => {
            const fileDate = fs.statSync(path.join(base, file)).birthtime;
            return fileDate > new Date(filterDate);
        }).map(file => {
            const fileDate = fs.statSync(path.join(base, file)).birthtime;
            
            return {
                file: file,
                fileDate: fileDate,
                pathToFIle: path.join(base, file)
            }
        });
        
        res.json({
            path: __dirname,
            dirs,
            files: filteredFilesAfterFilterDate,
            base,
        });
    }
    else {
        res.json({
            path: base,
            dirs: [],
            files: [],
            base: [],
        });
    }

});


app.get('/stream/:id', (req, res) => {
    const filePath = req.params.id;
    const file = fs.createReadStream(atob(filePath));
    res.setHeader('Content-Type', 'video/mp4');
    file.pipe(res);

    file.on('error', (err) => {
        console.log(err);
    });
});

app.get('/unlink/:id', (req, res) => {
    const filePath = req.params.id;
    fs.existsSync(atob(filePath)) && fs.unlinkSync(atob(filePath));
    res.json({filePath});
});


app.get('/send/:id', (req, res) => {
    const filePath = req.params.id;
    fs.existsSync(atob(filePath)) && res.sendFile(atob(filePath));
});



app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});