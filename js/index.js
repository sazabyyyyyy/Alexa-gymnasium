const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
let result = null;


exports.handler = async (event, context) => {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        let page = await browser.newPage();

        await page.goto(event.url || 'https://www.shsf.jp/chuo-g');

        //要素取得
        const tables=await page.$$('.even');
        let date;

        for(const table of tables){
            const data = await table.$('.data');
            date = await (await data.getProperty('textContent')).jsonValue();
        }

        result = date;

        // result = await page.title();
    } catch (error) {
        return context.fail(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return context.succeed(result);
};