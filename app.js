const Parser = require('rss-parser');
const parser = new Parser();

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

const printFeedData = async data => {
  // if the data array is of length 2, it means we have a description field
  if (data.length == 2) {
    const [desc, items] = data;

    // check to see if the authors field is defined
    const foundAuthors = items.find(item => item.author !== undefined);

    /* 
      this block runs if the authors field is not defined 
      printing only the:
        description
        title and
        link of each item in the rss-feed
    */
    if (!foundAuthors) {
      console.log('\n\ndescription: ' + desc + '\n\n');
      await sleep(1000);

      for (let i = 0; i < items.length; i++) {
        console.log(
          `Title: ${items[i].title}\n\nLink: ${items[i].link}\n\n\n\n `
        );
        await sleep(1000);
      }
      return;
    }

    /*
      this "block" runs if the authors filed is defined
      printing the:
        description
        title
        link and 
        author of each item in the rss-feed
    */

    console.log('\n\ndescription: ' + desc + '\n\n\n');
    await sleep(1000);

    for (let i = 0; i < items.length; i++) {
      console.log(
        `Title: ${items[i].title}\n\nLink: ${items[i].link}\n\nAuthor: ${items[i].author} \n\n\n\n `
      );
      await sleep(1000);
    }
    return;
  }

  // No description field
  const [items] = data;

  // check to see if the authors field is defined
  const foundAuthors = items.find(item => item.author !== undefined);

  /* 
      this block runs if the authors field is not defined 
      printing only the:
        title and
        link of each item in the rss-feed
    */
  if (!foundAuthors) {
    for (let i = 0; i < items.length; i++) {
      console.log(
        `Title: ${items[i].title}\n\nLink: ${items[i].link}\n\n\n\n `
      );
      await sleep(1000);
    }
    return;
  }

  /*
      this "block" runs if the authors filed is defined
      printing the:
        title
        link and 
        author of each item in the rss-feed
  */

  for (let i = 0; i < items.length; i++) {
    console.log(
      `\n\nTitle: ${items[i].title}\n\nLink: ${items[i].link}\n\nAuthor: ${items[i].author} \n\n\n `
    );
    await sleep(1000);
  }

  // delay function for timing out the logged info
  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
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
