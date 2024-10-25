import http from "http"
import path from "path"
import express from "express"
import { Server as SocketIO } from "socket.io"
import { spawn } from "child_process"

const app = express()
const server = http.createServer(app)
const io = new SocketIO(server)

const PORT = process.env.PORT || 3000
const YOUTUBE_CHANNEL_CODE = ""

const options = [
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rmtp://a.rmtp.youtube.com/live2/${YOUTUBE_CHANNEL_CODE}`
]

const ffmpegProcess = spawn('ffmpeg', options)

ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data}`)
})
ffmpegProcess.stderr.on('error', (err) => { 
    console.log(`ffmpeg stderr: ${err}`)
})
ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${err}`)
})

app.use(express.static(path.resolve('./public')))

io.on("connection", socket => {
    console.log("Socket connected socket.id =", socket.id)

    socket.on("binarystream", stream => {
        console.log("Binary stream incomming...")
        ffmpegProcess.stdin.write(stream, (err) => console.log(err))
    })
})

server.listen(PORT, () => console.log(`HTTP server is running on PORT ${PORT}`))