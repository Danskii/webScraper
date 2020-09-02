//REFERENCES:
//https://github.com/puppeteer/puppeteer/blob/v5.2.1/docs/api.md
//https://github.com/thomasdondorf/puppeteer-cluster

//TODO:

//require to include cluster for puppeteer
const { Cluster } = require("puppeteer-cluster");
//require below allows the file to be written to desktop
const fs = require("fs");

(async () => {
  // Create a cluster with 2 workers
  //https://github.com/thomasdondorf/puppeteer-cluster#clusterlaunchoptions
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    // monitor: true,
    //specifies the options to use on puppeteer launch https://github.com/puppeteer/puppeteer/blob/v5.2.1/docs/api.md#overview
    puppeteerOptions: {
      headless: true,
    },
  });

  // Define a task
  // Task built based on this video: https://www.youtube.com/watch?v=wqRKEd0_suw&feature=youtu.be

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(() => {
      let byLines = document.getElementsByTagName("body");
      const arrayOfBylines = [...byLines];
      return arrayOfBylines.map((item, index, array) =>
        item.innerHTML
          //clean up \n from innerHTML
          .replace(/\n/g, "")
          //clean up \t from innerHTML
          .replace(/\t/g, "")
          //fix \' to '  innerHTML
          .replace(/\'/g, "'")
      );
    });

    console.log(result);

    //THIS COMMAND WILL ONLY APPEND TO AN EXISTING HTML FILE CALLED SCRAPED.HTML
    //CREATE THE FILE BEFORE YOU RUN THE PROGRAM
    fs.appendFile("scraped.html", result, function (err) {
      if (err) return console.log(err);
      console.log("file created");
    });

    await browser.close();
  });

  // Add some pages to queue
  cluster.queue(
    "http://professionallyspeakingtest/publications/professionally_speaking/2020-06/2020-06-Reviews-PS.asp"
  );
  cluster.queue(
    "http://professionallyspeakingtest/publications/professionally_speaking/2020-03/2020-03-Reviews-PS.asp"
  );
  cluster.queue(
    "http://professionallyspeakingtest/publications/professionally_speaking/2019-12/2019-12-Reviews-PS.asp"
  );
  cluster.queue(
    "http://professionallyspeakingtest/publications/professionally_speaking/2019-09/2019-09-Reviews-PS.asp"
  );
  cluster.queue(
    "http://professionallyspeakingtest/publications/professionally_speaking/2019-06/2019-06-Reviews-PS.asp"
  );
  cluster.queue(
    "http://pourparlerprofessiontest/publications/professionally_speaking/2020-06/2020-06-Reviews-PPP.asp"
  );
  cluster.queue(
    "http://pourparlerprofessiontest/publications/professionally_speaking/2020-03/2020-03-Reviews-PPP.asp"
  );
  cluster.queue(
    "http://pourparlerprofessiontest/publications/professionally_speaking/2019-12/2019-12-Reviews-PPP.asp"
  );
  cluster.queue(
    "http://pourparlerprofessiontest/publications/professionally_speaking/2019-09/2019-09-Reviews-PPP.asp"
  );
  cluster.queue(
    "http://pourparlerprofessiontest/publications/professionally_speaking/2019-06/2019-06-Reviews-PPP.asp"
  );

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
})();
