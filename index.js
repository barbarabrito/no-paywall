const PORT = 5000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const { urlencoded } = require('express')


const app = express()

var hbs = exphbs.create({ /* config */ });

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('handlebars', hbs.engine);

app.use(express.static('public'));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home', {newspapers, article})
})


const newspapers = [

    {   
        id: 1,
        name: 'Folha de SP',
        container: '.c-news__body'
    },
    {   
        id: 2,
        name:'O Globo',
        container: '.article__content-container'
    },
    {
        id: 3,
        name: 'Estadão',
        container: '.n--noticia__content'
    },
    {   
        id: 4,
        name: 'UOL',
        container: '.text'
    }
]

var jURL = '';

let article = '';

let cContainer = '';


app.post('/formURL', urlencodedParser, function(req, res){
    console.log(req.body)
    jURL = req.body.url

    cContainer = req.body.thiscontainer

    if(jURL.includes('globo.com/saude/')){
        cContainer = '.content-text__container'
    }

    if(jURL.includes('blogs.oglobo.globo.com')){
        cContainer = '.post__content--article-post'
    }

    // console.log(cContainer)
    console.log(jURL)

    result()

    async function result(){

        try{
            await getData()
            res.redirect('/')

        }catch(err){
            console.log(err)
        }
    }  
})


async function getData() {

  try {

    const { data } = await axios.get(jURL);

    const $ = cheerio.load(data, {
      xml: {
        xmlMode: false,
        normalizeWhitespace: true,
        },
    });

    $('title').remove();
    $('figure').remove();
    $('button').remove();
    $('footer').remove();
    $('.js-gallery-widget').remove();
    $('.block__advertising-header').remove();
    $('.line-leia').remove();

    article = $(cContainer).text();
    // console.log(article)

    }catch (err) {

        console.error(err);
    }
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))