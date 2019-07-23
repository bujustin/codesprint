import openSocket from 'socket.io-client';

const socket = openSocket(getUrlPrefix());

function joinListener(roomName, callback) {
  socket.on("join_" + roomName, data => callback(data));
}

function startListener(roomName, callback) {
  socket.on("start_" + roomName, data => callback(data));
}

function finishListener(roomName, callback) {
  socket.on("finish_" + roomName, data => callback(data));
}

function getUrlPrefix() {
  let prefix = "";
  if (window.location.hostname === "localhost")
    prefix = "http://localhost:5000";
  else
    prefix = /*window.location.protocol +*/ "https://" + window.location.hostname;
  return prefix;
};

export { startListener, finishListener, joinListener, getUrlPrefix };

