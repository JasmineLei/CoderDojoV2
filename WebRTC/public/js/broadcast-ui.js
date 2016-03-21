﻿// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

var config = {
    openSocket: function(config) {
        // https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md
        // This method "openSocket" can be defined in HTML page
        // to use any signaling gateway either XHR-Long-Polling or SIP/XMPP or WebSockets/Socket.io
        // or WebSync/SignalR or existing implementations like signalmaster/peerserver or sockjs etc.

        var channel = config.channel || location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');
        var socket = new Firebase('https://webrtc.firebaseIO.com/' + channel);
        socket.channel = channel;
        socket.on('child_added', function(data) {
            config.onmessage(data.val());
        });
        socket.send = function(data) {
            this.push(data);
        };
        config.onopen && setTimeout(config.onopen, 1);
        socket.onDisconnect().remove();
        return socket;
    },
    onRemoteStream: function(media) {
        var video = media.video;
        video.setAttribute('controls', true);

        participants.insertBefore(video, participants.firstChild);

        video.play();
        rotateVideo(video);
    },
    onRoomFound: function(room) {
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        var tr = document.createElement("tr");
        $(tr).attr("id",room.broadcaster);
        //tr.setAttribute('id', room.broadcaster);
        console.log(room.broadcaster);
        (function(){
            var td = document.createElement("td");
            var std = document.createElement("td");
            var btnjoin = document.createElement("button");
            $(btnjoin).attr({
            class:"join",
            id:room.roomToken
            });
            $(btnjoin).text("Join Room");
            $(std).append($(btnjoin));
            $(td).text(room.roomName);
            $(tr).append($(td));
            $(tr).append($(std));
        })();
        
        //tr.innerHTML = '<td>' + room.roomName + '</td>' +
         //   '<td><button class="join" id="' + room.roomToken + '">Join Room</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        tr.onclick = function() {
            tr = this;
            captureUserMediaForNinja(function() {
                broadcastUI.joinRoom({
                    roomToken: tr.querySelector('.join').id,
                    joinUser: tr.id
                });
            });
            hideUnnecessaryStuff();
            //disableCreateBtn();
        };
    }
};

function createButtonClickHandler() {
    captureUserMedia(function() {
        broadcastUI.createRoom({
            roomName: (document.getElementById('conference-name') || { }).value || 'Anonymous'
        });
    });
    hideUnnecessaryStuff();
    //disableCreateBtn();
}

function captureUserMedia(callback) {
    var video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('controls', true);
    participants.insertBefore(video, participants.firstChild);

    getUserMedia({
        video: video,
        onsuccess: function(stream) {
            config.attachStream = stream;
            callback && callback();

            video.setAttribute('muted', true);
            rotateVideo(video);
        },
        onerror: function() {
            alert('unable to get access to your webcam.');
            callback && callback();
        }
    });
}
 
 function captureUserMediaForNinja(callback) {
    callback && callback();
}

/* on page load: get public rooms */
var broadcastUI = broadcast(config);

/* UI specific */
var participants = document.getElementById("participants") || document.body;
var startConferencing = document.getElementById('start-conferencing');
var roomsList = document.getElementById('rooms-list');

if (startConferencing) startConferencing.onclick = createButtonClickHandler;

function hideUnnecessaryStuff() {
    var visibleElements = document.getElementsByClassName('visible'),
        length = visibleElements.length;
    for (var i = 0; i < length; i++) {
        visibleElements[i].style.display = 'none';
    }
}

//function disableCreateBtn(){
//     startConferencing.style.display = 'none';
//}

function rotateVideo(video) {
    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(function() {
        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
}

(function() {
    
    var uniqueToken = document.getElementById('unique-token');
    var shareLink = document.getElementById('share-link');
    var plink = document.getElementById("plink");
    var b = document.createElement("h2");
    var ahref = document.createElement("a");
    
    $(b).css("text-align","center");
    $(ahref).attr({
        href:location.href,
        target:"_blank"
    });
    $(ahref).text("Share this link");
    $(b).append($(ahref));
    
    if (uniqueToken)
        if (location.hash.length > 2) $(shareLink).append($(b));
        else {
            var t = "broadcast/#"+(Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
            $(uniqueToken).text(t);
            $(plink).attr("href",t);
        }    
    
})();
