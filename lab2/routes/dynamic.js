var express = require('express');
var router = express.Router();

const students = [
  { name: 'Ситник Дмитро Сергійович', city: 'Кропивницький', photo: 'photo.jpg',  about: 'Мене звати Дмитро, я люблю котиків, вчуся в КПІ'},
  { name: 'Погорілець Владислав Миколайович', city: 'Кропивницький', photo: 'frog.png',  about: 'Мене звати Влад, я люблю котиків, вчуся в КПІ'},
  { name: 'Романюк Діана Петрівна', city: 'Кропивницький', photo: 'frog.png',  about: 'Мене звати Діана, я люблю котиків, вчуся в КПІ'},
  { name: 'Майко Денис Ростиславович', city: 'Луцьк', photo: 'DSC_3144_Maiko_Denys.jpg',  about: 'Мене звати Денис, я люблю котиків, вчуся в КПІ'},
  { name: 'Мосієвич Богдана Юріївна', city: 'Кропивницький', photo: 'frog.png',  about: 'Мене звати Богдана, я люблю котиків, вчуся в КПІ'}
];

router.get('/', function(req, response, next) {
  response.render('dynamic', { title: 'Dynamic Page', students: students});
});

module.exports = router;
