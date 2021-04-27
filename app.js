const Parser = require('rss-parser');
const parser = new Parser();
const { printFeedData } = require('./utils/printer');

const inputData = process.argv.slice(2);

const vettData = data => {
  if (data.length < 1)
    return console.log(
      'program aborted, please supply at least one rss-link for processing'
    );

  if (data.length > 2)
    return console.log(
      'Maximum number of links passed! Please pass in 2 or less links'
    );

  return data;
};

const handleAsyncError = fn => {
  return args => {
    return fn(args).catch(err =>
      console.error('an error occurred', err.message)
    );
  };
};

const getFeedData = async url => {
  const feed = await parser.parseURL(url);
  const { description, items } = feed;

  if (!description) return [items];
  return [description, items];
};

const run = async () => {
  const inputLinks = vettData(inputData);

  if (!inputLinks) return;

  if (inputLinks.length === 1) {
    const vettedGetFeedData = handleAsyncError(getFeedData);
    const vettedPrintFeedData = handleAsyncError(printFeedData);
    const feeds = await vettedGetFeedData(inputLinks[0]);
    await vettedPrintFeedData(feeds);

    return;
  }

  if (inputLinks.length > 1) {
    const vettedGetFeedData = handleAsyncError(getFeedData);
    const vettedPrintFeedData = handleAsyncError(printFeedData);
    for (let i = 0; i < inputLinks.length; i++) {
      if (i < 1) {
        const feeds = await vettedGetFeedData(inputLinks[i]);
        console.log('---- Printing feeds from the first link ----\n\n');
        await vettedPrintFeedData(feeds);
      } else {
        const feeds = await vettedGetFeedData(inputLinks[i]);
        console.log('---- Printing feeds from the second link ----\n\n');
        await vettedPrintFeedData(feeds);
      }
    }
  }
};

run();
