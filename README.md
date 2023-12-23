# RTSP Video Recorder - Node.JS

This script is designed to record a video stream from an RTSP source and save the recordings to the specified directory. It uses the `fluent-ffmpeg` library to handle the RTSP stream and create video files in MKV format.

## Features

- **Continuous Recording:** The script continuously records the video stream and starts a new recording when the previous one ends.

- **File Naming:** Recordings are named based on the start time, with the filename format `hour-minute-second.mkv`.

- **Automatic Deletion:** Monitors the available disk space, and if it exceeds the defined threshold, it deletes the oldest recordings to free up space.

## Configuration

To use the script, create a `config.json` file with the following parameters (based on `config.json.example` file):

- **rtspUrl:** The RTSP stream URL.
- **recordingsDirectory:** The base directory where recordings are saved.
- **segmentTimeSeconds:** The duration of each recording segment in seconds.
- **diskSpaceThresholdMb:** The maximum size of the recording directory in megabytes. After the directory exceeds this size, the script will delete the oldest recordings to free up space.

Example `config.json`:

```json
{
    "rtspUrl": "rtsp://admin:passwd@192.168.1.12/h264/main/av_stream",
    "recordingsDirectory": "recordings",
    "diskSpaceThresholdMb": 10000,
    "segmentTimeSeconds": 60
}
```

## Running the Script

To run the script, first install the dependencies:

```bash
npm install
```
---
Then run the script:
```bash
npm start
```

or

```bash
node index.js
```

## Stopping the Script

To stop the script, press `Ctrl + C` in the terminal window where it is running.
