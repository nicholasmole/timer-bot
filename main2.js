const notifier = require('node-notifier');
const path = require('path');
//const globaluser = require('./globaluser.js');
const ui = require('./userInterface.js');
const slack = require('./slackClient.js');
var gloChannel;
const sys = require('util');
const exec = require('child_process').exec;
var sleep = require('system-sleep');
var blessed = require('blessed');
//var keyboardJS = require('keyboardjs');
var gloVoice = 1;
const keyBindingsM = {};
var onlyonevoiceatatime = 1;

function letthevoicehappen(){
  onlyonevoiceatatime = 1;
}

keyBindingsM['C-v'] = voiceSwitch();
//var colors = require('colors');


function voiceSwitch(){
  //console.log('thie');
  gloVoice = gloVoice == 0 ? 1 : 0; 
}


function getRandomInt (max) {
  let number = Math.floor(Math.random() * Math.floor(max));
  return number = number * 10;
}

sleep(100);
const loading = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'Slack-a-tron',
  fullUnicode: true,
});
const loadingcontainer = blessed.box({
  width: '100%',
  height: '100%',
  style: {
    fg: '#bbb',
    bg: '#000',
  },
});
const loadingBarContainer = blessed.box({
  width: '100%',
  height: '100%',
  left: '0%',
  top: '0%',
  inputOnFocus: true,
  bg: '#FF0000',
  border: {
    fg: '#0000ff',
    type: 'line',
  },
});
let loadingcontent = blessed.text({
  width: '90%',
  left: '5%',
  top: '10%',
  align: 'left',
  content: '{bold}loading...{/bold}',
  tags: true,
});
function contentbar(time) {
  const loadingBarContent = blessed.textbox({
    width: '5%',
    height: '20%',
    left: time + '5%',
    top: '20%',
    inputOnFocus: true,
    bg: '#00ff00',
    border: {
      fg: '#00ff00',
      bg: '#00ff00',
      type: 'line',
    },
  });
  return loadingBarContent;
}

function newContent(time) {
  loadingcontainer.append(contentbar(time));
  let repeat = '.'.repeat(getRandomInt(time));
  loadingcontent.content = '{bold}loading'+repeat+'{/bold}';
  loading.render();
}
const loadingBarContent = blessed.textbox({
  parent: loadingBarContainer,
  width: '20%+1',
  height: '100%',
  left: '5%',
  top: '40%',
  inputOnFocus: true,
  bg: '#0000ff',
  border: {
    fg: '#0000ff',
    bg: '#0000ff',
    type: 'line',
  },
});

loading.append(loadingcontainer);


loading.append(loadingcontent);

//loading.append(loadingBarContent);
loading.render();
for (var i = 0; i < 10; i ++){
  newContent(i);
  sleep(getRandomInt(20));
}
// newContent(1);
// sleep(500);
// newContent(2);
// sleep(500);
// newContent(3);
// sleep(500);
// newContent(4);
//loadingBarContent.setW
//sleep(2000);
loading.remove(loadingcontainer);
loading.remove(loadingBarContainer);
loading.render();

sleep(1000);
//mainWindow.remove(slackBoxTitle);
//console.log("there");

const components = ui.init(); // ui components

let users;
let currentUser;
let channels;
let currentChannelId;

const UNKNOWN_USER_NAME = 'Unknown User';
// This is a hack to make the message list scroll to the bottom whenever a message is sent.
// Multiline messages would otherwise only scroll one line per message leaving part of the message
// cut off. This assumes that messages will be less than 50 lines high in the chat window.
const SCROLL_PER_MESSAGE = 50;

// generates ids for messages
const getNextId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();

exec(`afplay ./intro-beeps-2.wav  2>/dev/null & say "Good Morning" 2>/dev/null ` , (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

});
// handles the reply to say that a message was successfully sent
function handleSentConfirmation(message) {
  // for some reason getLines gives an object with int keys
  const lines = components.chatWindow.getLines();
  const keys = Object.keys(lines);
  let line;
  let i;
  for (i = keys.length - 1; i >= 0; i -= 1) {
    line = lines[keys[i]].split('(pending - ');
    if (parseInt(line.pop()[0], 10) === message.reply_to) {
      components.chatWindow.deleteLine(parseInt(keys[i], 10));

      if (message.ok) {
        components.chatWindow.insertLine(i, line.join(''));
      } else {
        components.chatWindow.insertLine(i, `${line.join('')} (FAILED)`);
      }
      break;
    }
  }
  components.chatWindow.scroll(SCROLL_PER_MESSAGE);
  components.screen.render();
}

// formats channel and user mentions readably
function formatMessageMentions(text) {
  if (text === null || typeof text === 'undefined') {
    return '';
  }

  let formattedText = text;
  // find user mentions
  const userMentions = text.match(/<@U[a-zA-Z0-9]+>/g);
  if (userMentions !== null) {
    userMentions
      .map(match => match.substr(2, match.length - 3))
      .forEach((userId) => {
        let username;
        let modifier;
        if (userId === currentUser.id) {
          username = currentUser.name;
          modifier = 'yellow-fg';
        } else {
          const user = users.find(potentialUser => potentialUser.id === userId);
          username = typeof user === 'undefined' ? UNKNOWN_USER_NAME : user.name;
          modifier = 'underline';
        }

        formattedText = text.replace(
          new RegExp(`<@${userId}>`, 'g'),
          `{${modifier}}@${username}{/${modifier}}`
        );
      });
  }

  // find special words
  return formattedText.replace(
    /<!channel>/g,
    '{yellow-fg}@channel{/yellow-fg}'
  );
}

function handleNewMessage(message) {
  let username;
  if (message.user === currentUser.id) {
    username = currentUser.name;
  } else {
    //Add a noise
    
    //function puts(error, stdout, stderr='') { sys.puts(stdout); }

    exec(`afplay ./goodcoin.wav  2>/dev/null ` , (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

    });
    

    const author = users.find(user => message.user === user.id);
    //const channel = users.find(user => message.user === channel.id);
    username = (author && author.name) || UNKNOWN_USER_NAME;

    if(message.channel != null){
      //global.channels 
    }
    //find channel name
    function isChannelNamebyId(gloablChannel) { 
      return gloablChannel.id === message.channel ;
    }
    //console.log(global.channels[0].id);
    //const wow = (global.channels).find(isChannelNamebyId);
    let wow = gloChannel.find(isChannelNamebyId);
    components.channelList.style.fg = '#ff0000';
    //console.log(gloChannel);
    components.chatWindow.focus();
    components.chatWindow.scroll(1);
    wow = (wow === undefined) ? ' ' : wow;
    //const users = global.user;
    //components.userList.setItems(users.map(slackUser => slackUser.name));
    notifier.notify({
      icon: path.join(__dirname, 'Slack_Mark_Black_Web.png'),
      message: `${username}: ${message.text} `,
      sound: true,
      title: `Slack: ${wow.name} `,
    });
    // console.log(components.messageInput.voicer);
    // console.log(components.messageInput.voicer);
    // console.log(components.messageInput.voicer);
    // console.log(components.messageInput.voicer);
    //console.log(components.voicer);
    //if (components.voicer) {
    //console.log(wow);
    if (username !== 'Unknown User' && onlyonevoiceatatime) {
      var string = message.text;
      var length = 50;
      var trimmedString = string.substring(0, length);
      onlyonevoiceatatime = 0;
      setTimeout(letthevoicehappen, 3000);
      exec(`say "${username} says ${trimmedString}"  2>/dev/null `, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    //say "Good Morning" 2>/dev/null 
  }
//console.log(message.channel);
  if (message.channel !== currentChannelId ||
      typeof message.text === 'undefined') {
    return;
  }

  components.chatWindow.insertBottom(
    `{bold}${username}{/bold}: ${formatMessageMentions(message.text)}`
  );
  components.chatWindow.scroll(SCROLL_PER_MESSAGE);
  components.screen.render();
}

slack.init((data, ws) => {
  currentUser = data.self;
  //global.globaluser = currentUser.name;
  // don't update focus until ws is connected
  // focus on the channel list
  components.channelList.select(0);
  components.channelList.focus();
  // re render screen
  components.screen.render();

  ws.on('message', (message /* , flags */) => {
    const parsedMessage = JSON.parse(message);
    if ('reply_to' in parsedMessage) {
      handleSentConfirmation(parsedMessage);
    } else if (parsedMessage.type === 'message') {
      handleNewMessage(parsedMessage);
    }
  });

  // initialize these event handlers here as they allow functionality
  // that relies on websockets

  //TEST BUTTONS
  components.messageInput.on('keypress', (ch, key) => {
    if (key.name === 'up') {

      components.chatWindow.focus();
      //upcomponents.chatWindow.focus();
      components.screen.render();
      //components.screen.render();
    }
  });

  // event handler when message is submitted
  components.messageInput.on('submit', (text) => {
    if (!text || !text.length) {
      components.messageInput.focus();
      return;
    }

    const id = getNextId();
    components.messageInput.clearValue();
    components.messageInput.focus();
    components.chatWindow.scrollTo(components.chatWindow.getLines().length * SCROLL_PER_MESSAGE);
    components.chatWindow.insertBottom(
      `{bold}${currentUser.name}{/bold}: ${text} (pending - ${id})`
    );
    components.chatWindow.scroll(SCROLL_PER_MESSAGE);

    components.screen.render();
    ws.send(JSON.stringify({
      id,
      type: 'message',
      channel: currentChannelId,
      text,
    }));
  });

  // set the user list to the users returned from slack
  // called here to check against currentUser
  slack.getUsers((error, response, userData) => {
    if (error || response.statusCode !== 200) {
      // console.log( // eslint-disable-line no-console
      //   'Error: ', error, response || response.statusCode
      // );
      return;
    }
    
    const parsedUserData = JSON.parse(userData);
    //users = parsedUserData.members.filter(user => !user.deleted && user.id !== currentUser.id);
    users = parsedUserData.members.filter(user => !user.deleted);
    global.user = users;
    components.userList.setItems(users.map(slackUser => slackUser.name));
    components.screen.render();
  });
});

// set the channel list
components.channelList.setItems(['Connecting to Slack...']);
components.screen.render();

// set the channel list to the channels returned from slack
slack.getChannels((error, response, data) => {
  if (error || response.statusCode !== 200) {
    // console.log( // eslint-disable-line no-console
    //   'Error: ', error, response && response.statusCode
    // );
    return;
  }

  const channelData = JSON.parse(data);
  channels = channelData.channels.filter(channel => !channel.is_archived);
  
  components.channelList.setItems(
    channels.map(slackChannel => slackChannel.name)
  );
  global.channels = channels;
  gloChannel = channels;
  // console.log( channels.map( slackChannel => slackChannel.name));
  // console.log( channels.map( slackChannel => slackChannel.id));
  //console.log( channels[0].id);
  components.screen.render();
});

// event handler when user selects a channel
function updateMessages(data, markFn) {
  components.chatWindow.deleteTop(); // remove loading message

  // filter and map the messages before displaying them
  data.messages
    .filter(item => !item.hidden)
    .filter(item => item.type === 'message')
    // Some messages related to message threading don't have text. This feature
    // isn't supported by terminal-slack right now so we filter them out
    .filter(item => typeof item.text !== 'undefined')
    .map((message) => {
      const len = users.length;
      let username;
      let i;

      // get the author
      if (message.user === currentUser.id) {
        username = currentUser.name;
       // global.globaluser = currentUser.name;
      } else {
        for (i = 0; i < len; i += 1) {
          if (message.user === users[i].id) {
            username = users[i].name;
            break;
          }
        }
      }
      return { text: message.text, username: username || UNKNOWN_USER_NAME };
    })
    .forEach((message) => {
      // add messages to window
      components.chatWindow.unshiftLine(
        `{bold}${message.username}{/bold}: ${formatMessageMentions(message.text)}`
      );
    });

  // mark the most recently read message
  if (data.messages.length) {
    markFn(currentChannelId, data.messages[0].ts);
  }

  // reset messageInput and give focus
  components.messageInput.clearValue();
  components.chatWindow.scrollTo(components.chatWindow.getLines().length * SCROLL_PER_MESSAGE);
  components.messageInput.focus();
  components.screen.render();
}

components.userList.on('select', (data) => {
  exec(`afplay ./selecton.wav  2>/dev/null` , (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;}
  });
  const username = data.content;

  // a channel was selected
  components.mainWindowTitle.setContent(`{bold}${username}{/bold}`);
  components.chatWindow.setContent('Getting messages...');
  components.screen.render();
  global.globaluser = username;
  // get user's id
  const userId = users.find(potentialUser => potentialUser.name === username).id;

  slack.openIm(userId, (error, response, imData) => {
    const parsedImData = JSON.parse(imData);
    currentChannelId = parsedImData.channel.id;

    // load im history
    slack.getImHistory(currentChannelId, (histError, histResponse, imHistoryData) => {
      updateMessages(JSON.parse(imHistoryData), slack.markIm);
    });
  });
});

components.channelList.on('select', (data) => {
  exec(`afplay ./selecton.wav -v 0.5  2>/dev/null` , (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;}
  });
  const channelName = data.content;

  // a channel was selected
  components.mainWindowTitle.setContent(`{bold}${channelName}{/bold}`);
  components.chatWindow.setContent('Getting messages...');
  components.screen.render();
  global.globaluser = channelName;
  // join the selected channel
  slack.joinChannel(channelName, (error, response, channelData) => {
    const parsedChannelData = JSON.parse(channelData);
    currentChannelId = parsedChannelData.channel.id;

    // get the previous messages of the channel and display them
    slack.getChannelHistory(currentChannelId, (histError, histResponse, channelHistoryData) => {
      updateMessages(JSON.parse(channelHistoryData), slack.markChannel);
    });
  });
});

function callKeyBindingsM(ch, key) {
  const fn = keyBindingsM[key.full];
  if (fn) {
    fn();
  }
}

components.chatWindow.on('keypress', callKeyBindingsM);
