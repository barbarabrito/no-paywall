const PORT = 5000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const { urlencoded } = require('express');


const app = express();

var hbs = exphbs.create({ /* config */ });

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('handlebars', hbs.engine);

app.use(express.static('public'));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home', {newspapers})
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
        container: '.content-text__container '
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

let jURL = '';

let article = [];

let cContainer = '';

let removeHTTPS = jURL;

let text = '';

app.post('/formURL', urlencodedParser, function(req, res){
    console.log(req.body)
    jURL = req.body.url

    cContainer = req.body.thiscontainer

    if(jURL.includes('blogs.oglobo.globo.com')){
        cContainer = '.post__content--article-post';
    }

    if(jURL.includes('estadao.com.br/internacional/') || jURL.includes('estadao.com.br/politica/')){
        cContainer = '.styles__Container-sc-1ehbu6v-0';
    }
    
    // console.log(jURL)

    result()

    async function result(){

        try{
            await getData()
            
            if (jURL.includes('https://')){
                removeHTTPS = jURL.replace('https://', '');
            }else if (jURL.includes('http://')){
                removeHTTPS = jURL.replace('http://', '');
            }

            app.get(`/${removeHTTPS}`, function (req, res) {
              res.render('article', {text, article})
            })

            res.redirect(`/${removeHTTPS}`);

        }catch(err){
            console.log(err);
        }
    }  
})


async function getData() {

  try {

    const response = await axios.get(jURL);

    const $ = cheerio.load(response.data, {xmlMode: false});

        $('title').remove();
        $('figure').remove();
        $('button').remove();
        $('footer').remove();
        $('.js-gallery-widget').remove();
        $('.block__advertising-header').remove();
        $('.line-leia').remove();
        $('style').remove();

        if(cContainer === '.content-text__container'){
            
            article = [];
            text = $(cContainer).text();
            article.push({
                  text
                });
            console.log(text);
        }else{

            article = [];
            $(cContainer+' p').each(function(){
                text = $(this).text();
                article.push({
                  text
                });
            });
            console.log(text);
        }
    }catch (err) {

        console.error(err);
    }
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))