const fetchImageMetaData = (id) => {
  return {
    id: id,
    title: 'Sunset',
    description: 'Taken in Mexico - may be useful in an advertisement',
    creator: 'Steven A. Brown',
    date: new Date(),
  };
};

const createUser = (userName) => {
  console.log('saving..');
  console.log(`user "${userName}" created`);
};

exports.fetchImageMetaData = fetchImageMetaData;
exports.createUser = createUser;
