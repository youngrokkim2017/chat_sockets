const chatForm = document.getElementById('chat-form');
const socket = io();

// GET username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Join Chat Room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Server side message
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll: every time you get a message
    // automatically does the scroll
    chatMessages.scrollTop = chatMessages.scrollHeight
});

// message submit event listener
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;  // getting the message by the id
    // console.log(msg);

    // emitting message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
					<p class="text">
						${message.text}
                    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function  outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}