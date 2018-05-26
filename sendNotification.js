const axios = require('axios');
const BOT_TOKEN = 'qwertyqwertyqwertyqwerty'

module.exports = message => {
  axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: '-111111111111',
    text: message
  })
}
