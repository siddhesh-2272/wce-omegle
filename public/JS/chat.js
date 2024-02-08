const FORM_INPUT_DISABLED_COLOR = '#000000';
const FORM_INPUT_MSG_COLOR = '#ffffff';
const FORM_INPUT_SEND_COLOR = '#f6166c';
const MSG_MINE_COLOR = 'linear-gradient(to bottom, #ff99ff 0%, #ff0066 100%)';

const MSG_PARTNER_COLOR = 'linear-gradient(to bottom left, #33ccff 0%, #3333cc 100%)';

let socket = io('/');

let timeout;
let partner_id, partner_username, partner_avatar, my_id;
let audio = new Audio('../assets/sounds/notif.mp3');

document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
document.getElementById("partnername").innerHTML = " ";
document.getElementById("partnerimg").src = " ";
document.getElementById("m").style.pointerEvents = "none";
document.getElementById("m").style.background = FORM_INPUT_DISABLED_COLOR;
document.getElementById("submitButton").style.pointerEvents = "none";
document.getElementById("submitButton").style.background = FORM_INPUT_DISABLED_COLOR;

const messagesDiv = document.getElementById("messages");

let partnerMessage = '<div class="partner">You are talking with:' + partner_username + '</div>';

function timeoutFunction() {
    socket.emit('typing', false);
}

function isTyping() {
    socket.emit('typing', true);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
}

socket.on('typing', function (data) {
    const istypingLabel = document.getElementById("istyping");
    if (data) {
        istypingLabel.style.visibility = "visible";
    } else {
        istypingLabel.style.visibility = "hidden";
    }
});

function submitForm() {
    console.log('Form submitted!');
    var msg = document.getElementById("m").value.trim();

    if (msg != '') {
        socket.emit('chat message', { msg: msg, target: partner_id });
    }

    document.getElementById("m").value = '';

    return false;
}

socket.on('init', function (data) {
    socket.username = data.username;
    socket.avatar = data.avatar;
    my_id = data.my_id;
    document.getElementById("myname").innerHTML = socket.username;
    document.getElementById("myimg").src = "https://api.multiavatar.com/Binx Bond.png";
});

socket.on('chat message mine', function (msg) {
    console.log('Message sent from me: ' + msg);
    let output_msg = msg;
    let meDiv = document.createElement('div');
    meDiv.className = 'me';
    meDiv.style.display = 'none';
    meDiv.style.background = MSG_MINE_COLOR;
    meDiv.innerHTML = output_msg;
    messagesDiv.appendChild(meDiv);
    meDiv.style.display = 'block';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('chat message partner', function (msg) {
    console.log('Message received from partner: ' + msg);
    audio.play();
    let output_msg = msg;
    let partnerDiv = document.createElement('div');
    partnerDiv.className = 'partner';
    partnerDiv.style.display = 'none';
    partnerDiv.style.background = MSG_PARTNER_COLOR;
    partnerDiv.innerHTML = output_msg;
    messagesDiv.appendChild(partnerDiv);
    partnerDiv.style.display = 'block';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});



socket.on('disconnecting now', function (msg) {
    messagesDiv.innerHTML += '<div class="partner">' + msg + "</div>";
    alert("Oops! your partner has disconnected , refreshing please wait.");
    window.location.reload();
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    document.getElementById("partnername").innerHTML = " ";
    document.getElementById("partnerimg").src = " ";
    document.getElementById("m").style.pointerEvents = "none";
    document.getElementById("m").style.background = FORM_INPUT_DISABLED_COLOR;
    document.getElementById("submitButton").style.pointerEvents = "none";
    document.getElementById("submitButton").style.background = FORM_INPUT_DISABLED_COLOR;
    document.getElementById("m").placeholder = "";
});

socket.on('partner', function (partner_data) {
    if (partner_id == null) {
        document.getElementById("partnername").innerHTML = partner_data.username;
        document.getElementById("partnerimg").src = "https://xsgames.co/randomusers/avatar.php?g=pixel";
        document.getElementById("m").style.pointerEvents = "auto";
        document.getElementById("m").style.background = FORM_INPUT_MSG_COLOR;
        document.getElementById("submitButton").style.pointerEvents = "auto";
        document.getElementById("submitButton").style.background = FORM_INPUT_SEND_COLOR;
        partner_id = partner_data.id;
        partner_username = partner_data.username;
        partner_avatar = partner_data.avatar;
        document.getElementById("m").placeholder = "Type to send a message";

        // Include the partner's name in the message
        let partnerMessage = '<div class="partner">You are talking with ' + partner_username + '</div>';
        messagesDiv.innerHTML += partnerMessage;

        socket.emit('partner', {
            target: partner_id,
            data: {
                id: socket.id,
                username: socket.username,
                avatar: socket.avatar
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const msgInput = document.getElementById("m");
    msgInput.emojioneArea({
        saveEmojisAs: 'shortname',
        events: {
            keyup: function (editor, event) {
                if (event.which == 13) {
                    document.getElementById("msgform").submit();
                } else {
                    isTyping();
                }
            }
        }
    });
});
