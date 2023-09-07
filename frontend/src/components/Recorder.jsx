import React, { Component } from "react";
import RecordRTC from "recordrtc";
import "../CSS/Recorder.css";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Navbar from "./Navbar";

class RecordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      screenStream: null,
      webcamStream: null, // Added webcam stream state
      src: null,
      isRecording: false,
    };

    this.toggleRecord = this.toggleRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.downloadVideo = this.downloadVideo.bind(this);
    this.toggleCamera = this.toggleCamera.bind(this);
  }

  async toggleRecord() {
    if (!this.state.isRecording) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        const recorder = new RecordRTC(screenStream, { type: "video" });
        recorder.startRecording();
        this.setState({
          recordVideo: recorder,
          screenStream,
          isRecording: true,
        });

        // Access the user's camera for live feed
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        this.setState({ webcamStream });

        // Set the live camera feed as the source for the webcam video element
        this.webcamVideo.srcObject = webcamStream;
      } catch (error) {
        console.error("Error accessing screen or webcam:", error);
      }
    } else {
      this.stopRecord();
    }
  }
  toggleMute() {
    const { webcamStream, isMuted } = this.state;
    const audioTracks = webcamStream.getAudioTracks();

    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !isMuted;
      this.setState({ isMuted: !isMuted });
    }
  }

  toggleCamera() {
    const { webcamStream, isCameraOn } = this.state;
    const videoTracks = webcamStream.getVideoTracks();

    if (videoTracks.length > 0) {
      videoTracks[0].enabled = !isCameraOn;
      this.setState({ isCameraOn: !isCameraOn });
    }
  }

  async stopRecord() {
    const { recordVideo, screenStream, webcamStream } = this.state;
    if (!recordVideo) return;

    recordVideo.stopRecording(() => {
      const blob = recordVideo.getBlob();
      const videoSrc = window.URL.createObjectURL(blob);
      this.setState({ src: videoSrc, isRecording: false });

      screenStream.getTracks().forEach((track) => track.stop());
      webcamStream.getTracks().forEach((track) => track.stop());
    });
  }
  downloadVideo() {
    const { src } = this.state;

    if (src) {
      const a = document.createElement("a");
      a.href = src;
      a.download = "recorded-video.mp4"; // Set the default filename
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  render() {
    const { src, isRecording } = this.state;

    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="video-container1">
            {src ? (
              <video controls autoPlay src={src} className="recorded-video" />
            ) : null}
          </div>
          <div className="video-container2">
            {/* Live camera feed displayed here */}
            <video
              autoPlay
              playsInline
              ref={(ref) => (this.webcamVideo = ref)} // Ref for webcam video element
              className={`webcam-video ${isRecording ? "" : "hidden"}`}
            ></video>
          </div>
          <div>
            <button className="submit" onClick={this.toggleRecord}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <div className="save">
              {src && (
                <button className="download" onClick={this.downloadVideo}>
                  <FileDownloadIcon />
                  <p> Download Video</p>
                </button>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RecordPage;
