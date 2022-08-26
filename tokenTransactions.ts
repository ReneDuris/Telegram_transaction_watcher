import  axios  from "axios";
import TelegramBot from 'node-telegram-bot-api';
const BOT_TOKEN="TOKEN_OF_YOUR_TELEGRAM_BOT"; // your bot token after you will create it in bot father in telegram
const bot = new TelegramBot(BOT_TOKEN, {polling: true});
const API = "https://api.elrond.com";
  var old = null;

    const getTransactions = async (chatId:any,minimumValue:Number,tokenIdentifier: string) => {
    const url = `${API}/transactions?from=0&size=1&token=${tokenIdentifier}`;
    try {
      const response = await axios.get(url);
      const tx = response.data[0].txHash;
      const name = response.data[0].action.name;

      if (name == "transfer"){
        const token = Buffer.from((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[1], 'hex').slice(0, -7);
        const value = (parseInt((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[2], 16))/ 10**18;
        const sender = response.data[0].sender;
        const receiver = response.data[0].receiver;
        const txHash = response.data[0].txHash;
       
        const link = "https://explorer.elrond.com/transactions/"+txHash;
        if (value > minimumValue){
        var data = "Sent " + Math.round(value*100)/100 + " " + token  + "\n" + "\n" +
                    "from: " + sender  + "\n" +"\n" +
                    "to: " + receiver  + "\n" + "\n" +
                     link
                  }
        else {
          var data = "0";
        }
      }
      else if ( name == "swap"){
        const token_sent = Buffer.from((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[1], 'hex').slice(0, -7);
        const token_recieved = Buffer.from((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[4], 'hex').slice(0, -7);
        const value_sent = (parseInt((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[2], 16))/ 10**18;
        const value_recieved = (parseInt((Buffer.from(response.data[0].data, 'base64').toString()).split('@')[5], 16))/ 10**18;
        const txHash = response.data[0].txHash;
        const link = "https://explorer.elrond.com/transactions/"+txHash;
        if (value_sent > minimumValue ){
        var data = "Swapped " + Math.round(value_sent * 100)/100 + " " + token_sent + " for" + "\n" +
                    Math.round(value_recieved * 100)/100 + " " + token_recieved + "\n" +"\n" +  link
                    ;
                  }
        else{
          var data = "0";
        }
      }
      const saved = tx;
      if(saved !== old) {
        old = saved;
        if (data != "0"){
        bot.sendMessage(chatId ,data,{disable_web_page_preview:true}); 
        }    
    }
  } catch (error) {
      console.log(error);
      return 0;
    }
  };

  //INPUT YOUR DATA
  // chatID = CHAT OF ID YOU WANT TO SENT THE MESSAGE
  // value = MINIMUM VALUE YOU WANT TO WATCH
  // token = TOKEN IDENTIFIER THAT YOU WANT TO WATCH

  function interval(){
    const chatId = "YOUR_CHAT_ID";
    const value = 1; //minimum amount to watch
    const token = "TOKEN_IDENTIFIER";
      getTransactions(chatId,value,token)
    }
    setInterval(interval, 2000); //interval

