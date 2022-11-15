const api = require('./src/api');
const auth = require('./src/auth');
const fs = require('fs');


// Получение чатов
// (async () => {
//   await auth();

//   const chatsResp = await api.call('messages.getAllChats', {
//     except_ids: 10
//   });

//   const chat = chatsResp.chats.filter(c => c.title === 'Тестовый приватный канал с запретом на копирование');

//   console.log(chat);

// })()


// Получение сообщений
(async () => {

  await auth();

  const inputPeer = {
    _: 'inputPeerChannel',
    access_hash: '17906011120624565020',
    channel_id: '1656091863'
  }

  const LIMIT_COUNT = 10;
  const allMessages = [];

  const firstHistoryResult = await api.call('messages.getHistory', {
    peer: inputPeer,
    limit: LIMIT_COUNT
  });

  const historyCount = firstHistoryResult.count;

  for(let offset = 0; offset < historyCount; offset += LIMIT_COUNT) {
    console.log('offset', offset);
    const history = await api.call('messages.getHistory', {
      peer: inputPeer,
      limit: LIMIT_COUNT,
      add_offset: offset
    });

    allMessages.push(...history.messages);
  }

  fs.writeFileSync('mess.json', JSON.stringify(allMessages));
  
})();