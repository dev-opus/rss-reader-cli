const inputData = process.argv.slice(2);

const vetData = data => {
  return (
    data.length > 2 &&
    console.log(
      'Maximum number of links passed! Please pass in 2 or less links'
    )
  );
};

const handleAsyncError = fn => {
  return args => {
    return fn(args).catch(err =>
      console.error('an error occurred', err.message)
    );
  };
};
