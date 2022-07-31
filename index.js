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

app.post('/formURL', urlencodedParser, function(req, res){
    
    let jURL = '';
    let removeHTTPS = jURL;

    console.log(req.body)
    jURL = req.body.url

    result()

    async function result(){

        try{
            
            if (jURL.includes('https://')){
                removeHTTPS = jURL.replace('https://', '');
            }else if (jURL.includes('http://')){
                removeHTTPS = jURL.replace('http://', '');
            }
            app.get(`/${removeHTTPS}`, function (req, res) {
              res.render('article')
            })
            res.redirect(`/${removeHTTPS}`);
            browse(jURL);
        }catch(err){
            console.log(err);
        }
    }  
})


async function browse(jURL){

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(jURL);
    page.setJavaScriptEnabled(false)
    await page.evaluate(() => {
        location.reload(true)
    })
    return page;
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))