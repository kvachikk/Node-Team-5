import express, { Router } from 'express';
import path from 'path';

const app = express();

const __dirname = path.resolve();
const PORT = 3000;
const router = Router();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


app.use(express.static(__dirname+"/"));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use(router);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
});