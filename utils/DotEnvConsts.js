// В ТЗ указано, что пока не надо создавать файл переменных окружения,
// поэтому пока просто выношу в константы

const SECRET_KEY = 'c7c10cc91cc20870e038950e9928a8fba0c38d76b582e3ec61522953117bc151';
const SERVER_URL = 'mongodb://localhost:27017/mestodb';

module.exports = {
  SECRET_KEY,
  SERVER_URL,
};
