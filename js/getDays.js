const puppeteer = require("puppeteer");
const fs = require('fs');

async function test() {

    //ヘッドレスモードでページ開く
    const browser=await puppeteer.launch();
    const page =await browser.newPage();

    const URL='https://www.shsf.jp/chuo-g';


    //URLアクセス
    await page.goto(URL,{
        waitUntil: 'domcontentloaded'
    });



    //要素取得
    const tables=await page.$$('.even');
    let date;

    for(const table of tables){
        const data = await table.$('.data');
        date = await (await data.getProperty('textContent')).jsonValue();
    }


    //Chromunium終了
    await page.close();


    //jsonファイル作成
    const obj = {
        days:date
    };

    const json=JSON.stringify(obj);

    fs.writeFile('day.json',json,(err)=> {
        if (err) console.log(`error!::${err}`);
    });
}


(async ()=> {

   test();

})();