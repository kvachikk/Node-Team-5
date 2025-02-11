import express, { Router } from 'express';
import path from 'path';

const app = express();

const __dirname = path.resolve();
const PORT = 3000;
const router = Router();

app.set('view engine', 'ejs');

app.get('/student/:key', function (req, res) {
    const key = req.params.key;

    //Сформуйте масив інформації
    //Фотки закидуйте в папку img
    const students = [{ name: 'Ситник Дмитро Сергійович', 
        city: 'Кропивницький', 
        photo: '<img src="/assets/img/photo_2025-02-10_20-53-39.jpg" class="" alt="Фото студента">',
        about: 'Мене звати Дмитро, я люблю котиків, вчуся в КПІ, а також сиджу налаштовую шаблонізатор аби він працював'},
                     { name: 'Майко Денис Ростиславович', 
        city: 'Луцьк', 
        photo: '<img src="/assets/img/DSC_3144_Maiko_Denys.jpg" class="" alt="Фото студента">',
        about: 'Хелло! Я Денис, навчаюся у КПІ, готуюся підкоряти світ)'}
                     ]

    res.render('student', students[key]);
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.use(express.static(__dirname + "/"));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
});
