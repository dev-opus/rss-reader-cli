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
    console.log('description: ' + desc);

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
  for (let i = 0; i < items.length; i++) {
    console.log(
      `Title: ${items[i].title}\n\nLink: ${items[i].link}\n\nAuthor: ${items[i].author} \n\n\n `
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
