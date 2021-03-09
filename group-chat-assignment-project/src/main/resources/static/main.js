
'use strict';
const url = 'http://localhost:8080';
let usernamePage = document.querySelector('#username-page');
let chatPage = document.querySelector('#chat-page');
let usernameForm = document.querySelector('#usernameForm');
let messageForm = document.querySelector('#messageForm');
let messageInput = document.querySelector('#message');
let messageArea = document.querySelector('#messageArea');
let connectingElement = document.querySelector('.connecting');

let stompClient = null;
let username = null;

let colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function enterChat(event) {
  const max_user_len = 20;
  username = document.querySelector('#username').value.trim();

  if(username && username.length < max_user_len) {
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    connectToSocket();
  } else {
    document.querySelector('#usernameError').classList.remove('hidden');
  }
  event.preventDefault();
}

function connectToSocket() {
  let socket = new SockJS(url + '/chat');
  stompClient = Stomp.over(socket);

  stompClient.connect({}, onConnected, onError);
}

// stomp clients connect callback
function onConnected(frame) {
  console.log('Connected: ' + frame);
  stompClient.subscribe('/topic/public', onMessageReceived);
  stompClient.send("/app/newUser",
    {},
    JSON.stringify({
      sender: username,
      type: 'JOIN',
      dateTime: moment().format('DD/MM/YYYY hh:mm:ss')
    })
  )
  connectingElement.classList.add('hidden');
}

// stomp clients connect error callback
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
  const max_message_len = 256;
  let messageContent = messageInput.value.trim();
  let messageError = document.querySelector('#messageError');

  if(messageContent && messageContent.length < max_message_len && stompClient) {
    messageError.classList.add('hidden');
    let chatMessage = {
      sender: username,
      text: messageInput.value,
      type: 'TEXT',
      dateTime: moment().format('DD/MM/YYYY hh:mm:ss')
    };
    stompClient.send("/app/send", {}, JSON.stringify(chatMessage));
    messageInput.value = '';
  } else {
    messageError.classList.remove('hidden');
  }
  event.preventDefault();
}

// on message received callback handler
function onMessageReceived(payload) {
  let response = JSON.parse(payload.body);
  if (Array.isArray(response)) {
    for (let message of response) {
      printMessage(message);
    }
  } else {
    printMessage(response);
  }
  messageArea.scrollTop = messageArea.scrollHeight;
}

// prints different message depending on message type
function printMessage(message) {
  let messageElement = document.createElement('li');

  switch(message.type) {
    case 'JOIN':
      messageElement.classList.add('event-message');
      message.text = message.sender + ' joined!';
      break;
    case 'LEAVE':
      messageElement.classList.add('event-message');
      message.text = message.sender + ' left!';
      break;
    case 'TEXT':
      messageElement.classList.add('chat-message');
      messageElement.appendChild(createAvatarElement(message.sender));
      messageElement.appendChild(createElement(message.sender, 'span'));
      break;
    default:
  }
  messageElement.appendChild(createElement(message.dateTime, 'p2'));
  messageElement.appendChild(createElement(message.text, 'p'));

  messageArea.appendChild(messageElement);
}

function createAvatarElement(messageSender) {
  let avatarElement = document.createElement('i');
  let avatarText = document.createTextNode(messageSender[0]);
  avatarElement.appendChild(avatarText);
  avatarElement.style['background-color'] = getAvatarColor(messageSender);
  return avatarElement;
}

function createElement(value, elementName) {
  let element = document.createElement(elementName);
  let text = document.createTextNode(value);
  element.appendChild(text);
  return element;
}

// get random color by username of messageSender
function getAvatarColor(messageSender) {
  let hash = 0;
  for (let i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }
  let index = Math.abs(hash % colors.length);
  return colors[index];
}

usernameForm.addEventListener('submit', enterChat, true)
messageForm.addEventListener('submit', sendMessage, true)