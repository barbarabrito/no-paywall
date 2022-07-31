const PORT = 5000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
const puppeteer = require('puppeteer');

const app = express();

var hbs = exphbs.create({ /* config */ });

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('handlebars', hbs.engine);

app.use(express.static('public'));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home')
})

let article;

app.post('/formURL', urlencodedParser, function(req, res){
    
    let jURL = '';
    let redirectToArticle = jURL;

    console.log(req.body)
    jURL = req.body.url

    try{

        if (jURL.includes('https://')){
            redirectToArticle = jURL.replace('https://', '');
        }else if (jURL.includes('http://')){
            redirectToArticle = jURL.replace('http://', '');
        }
        
        app.get(`/${redirectToArticle}`, async function (req, res) {
            await scrape(jURL);
            res.render('article', {article})
        })
        res.redirect(`/${redirectToArticle}`);

    }catch(err){
        console.log(err);
    }
})

async function browse(jURL){

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(jURL);
    page.setJavaScriptEnabled(false)
    await page.reload();
    const pageContent = page.content();
    return pageContent;
    await browser.close();
}

async function scrape(jURL){ 
    const html = await browse(jURL);
    const $ = cheerio.load(html);
    article = html;
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))