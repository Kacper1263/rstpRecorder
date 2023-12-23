const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const path = require('path');


const configPath = 'config.json';
if (!fs.existsSync(configPath)) {
    console.error("No config file ", configPath, " found");
    process.exit(1);
}
let config = {};
try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configContent);
} catch (error) {
    console.error('Error wile reading config:', error);
}

const rtspUrl = config.rtspUrl;
const recordingsDirectory = config.recordingsDirectory;
const segmentTime = config.segmentTimeSeconds || 120;

// create recordings directory if not exists
fs.ensureDirSync(recordingsDirectory);

let currentRecording = null;

function startRecording() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const outputPath = path.join(recordingsDirectory, `recording_${timestamp}.mkv`);

    currentRecording = ffmpeg(rtspUrl)
        .inputFormat('rtsp')
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
            '-reset_timestamps', '1',
            '-rtsp_transport', 'tcp',
        ])
        .output(outputPath)
        .on('end', () => {
            console.log('Recording ended, starting a new one.');
            setTimeout(() => {
                startRecording(); 
            }, 50);
        })
        .on('error', (err) => {
            console.error('Error during recording:', err);
            setTimeout(() => {
                startRecording();
            }, 50);
        });
        currentRecording.run();
}

function stopRecording() {
    return new Promise((resolve) => {
        if (currentRecording) {
            currentRecording.on('end', () => {
                currentRecording = null;
                resolve();
            });
            currentRecording.ffmpegProc.stdin.write('q');
            currentRecording.ffmpegProc.stdin.end();
        } else {
            resolve();
        }
    });
}

// start recording
console.log('Starting recording.');
startRecording();

// stop recording after x seconds
setInterval(() => {
    console.log('Stopping segment..');
    stopRecording();
}, config.segmentTimeSeconds * 1000);