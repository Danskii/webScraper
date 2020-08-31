const { Cluster } = require("puppeteer-cluster");

(async () => {
  // Create a cluster with 2 workers
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
  });

  // Define a task
  // Task built based on this video: https://www.youtube.com/watch?v=wqRKEd0_suw&feature=youtu.be

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(() => {
      let byLines = document.querySelectorAll(".byLine");
      const arrayOfBylines = [...byLines];
      return arrayOfBylines.map((h) => h.innerHTML);
    });

    console.log(result);
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

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
})();
