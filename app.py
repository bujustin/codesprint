import random
import string
import requests
import json
import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)
app.secret_key = "asdf1234"
socketio = SocketIO(app)

languageExtensionDict = {
    "python": ".py",
    "java": ".java",
    "javascript": ".js",
    "php": ".php"
}
auth = ""
if os.path.isfile("env"):
    auth = open("env", "r").read()
    # auth = "&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}"

storage = {}



@app.route("/")
@app.route("/about")
@app.route("/solo-game")
@app.route("/multi-game/<roomName>")
def index(roomName=None):
    return render_template("index.html")

@app.route("/new", defaults={"language": "python", "lines": "10"})
@app.route("/new/<language>/<lines>")
def newroom(language, lines):
    length = 10
    letters = string.ascii_lowercase
    roomName = "".join(random.choice(letters) for i in range(length))

    storage[roomName] = {
        "text": generate(language, lines),
        "players": 0,
        "times": {}
    }
    return roomName

@app.route("/room/<roomName>")
def joinroom(roomName):
    if roomName not in storage:
        return "room name does not exist"

    storage[roomName]["players"] += 1

    socketio.emit("join_" + roomName, {"players": storage[roomName]["players"]})
    return json.dumps(storage[roomName])

@app.route("/start/<roomName>")
def start(roomName):
    if roomName not in storage:
        return "room name does not exist"

    socketio.emit("start_" + roomName, {"text": storage[roomName]["text"]})
    return ""

@app.route("/finish/<roomName>/<playerId>/<time>")
def finish(roomName, playerId, time):
    if roomName not in storage:
        return "room name does not exist"

    storage[roomName]["players"] -= 1
    storage[roomName]["times"][playerId] = int(time)

    if storage[roomName]["players"] == 0:
        socketio.emit("finish_" + roomName, {"times": storage[roomName]["times"]})
    return ""

@app.route("/generate/<language>/<lines>")
def generate(language, lines):
    return "public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}"

def generate2(language, lines):
    if language not in languageExtensionDict:
        return "invalid language"
    extension = languageExtensionDict[language]

    url = "https://api.github.com/search/repositories?q=language:{}{}".format(language, auth)
    json = requests.get(url).json()

    repoIndex = random.randint(0, len(json["items"]))
    repoName = json["items"][repoIndex]["full_name"]
    repoFilesUrl = "https://api.github.com/repos/{}/git/trees/master?recursive=1{}".format(repoName, auth)
    
    repoFilesJson = requests.get(repoFilesUrl).json()
    if "tree" not in repoFilesJson:
        return "error"

    for file in repoFilesJson["tree"]:
        path = file["path"]

        if path != None and path[-1*len(extension):] == extension:
            downloadUrl = "https://raw.githubusercontent.com/{}/master/{}".format(repoName, path)
            text = requests.get(downloadUrl).text.strip()
            if text == "":
                continue
            arr = text.split("\n")
            return "\n".join(arr[:min(int(lines), len(arr))])

    return "not found"

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    # app.run(host='0.0.0.0', port=port)
    socketio.run(app, host='0.0.0.0', port=port)
