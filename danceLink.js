module.exports = function danceVideos() { 
const danceVideos = ['https://giphy.com/gifs/KEf3gS3Pg9HulxVcMI/html5', 'https://giphy.com/gifs/JTJtSz7aJuMjUUjmQ6/html5', 'https://giphy.com/gifs/WsWp0hZ7M7vyWuEIQW/html5', 'https://giphy.com/gifs/LnjKIIDcNdprgiQEva/html5' ]
const item = danceVideos[Math.floor(Math.random() * danceVideos.length)]
return item 
}
