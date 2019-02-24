/* eslint-disable strict */
const STORE = {
  lists: [
    {
      id: '1',
      header: 'First list',
      cardIds: [1,2]
    },
    {
      id: '2',
      header: 'Second list',
      cardIds: [1,2,3]
    },
  ],
  allCards: [
    { id: 1,
      title: 'First card', 
      content: 'lorem ipsum' 
    },
    { id: 2,
      title: 'Second card', 
      content: 'lorem ipsum' 
    },
    { id: 3,
      title: 'Third card', 
      content: 'lorem ipsum' 
    },
  ],
};

module.exports = STORE;