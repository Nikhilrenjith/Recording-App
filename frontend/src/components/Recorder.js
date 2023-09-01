import React, { Component } from "react";
import RecordRTC from "recordrtc";
import "../CSS/Recorder.css";
import Navbar from "./Navbar";

class RecordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      screenStream: null,
      webcamStream: null,
      src: null,
      webcamSrc: null,
      isRecording: false,
    };

    this.toggleRecord = this.toggleRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
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

        // Start recording webcam
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const webcamRecorder = new RecordRTC(webcamStream, { type: "video" });
        webcamRecorder.startRecording();
        this.setState({
          webcamStream,
          webcamRecorder,
        });
      } catch (error) {
        console.error("Error accessing screen or webcam:", error);
      }
    } else {
      this.stopRecord();
    }
  }

  async stopRecord() {
    const { recordVideo, screenStream, webcamRecorder, webcamStream } =
      this.state;
    if (!recordVideo) return;

    recordVideo.stopRecording(() => {
      const blob = recordVideo.getBlob();
      const videoSrc = window.URL.createObjectURL(blob);
      this.setState({ src: videoSrc, isRecording: false });

      screenStream.getTracks().forEach((track) => track.stop());
    });

    // Stop recording webcam and set webcamSrc
    webcamRecorder.stopRecording(() => {
      const webcamBlob = webcamRecorder.getBlob();
      const webcamVideoSrc = window.URL.createObjectURL(webcamBlob);
      this.setState({ webcamSrc: webcamVideoSrc });

      webcamStream.getTracks().forEach((track) => track.stop());
    });
  }

  render() {
    const { src, webcamSrc, isRecording } = this.state;

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
            {webcamSrc ? (
              <video
                controls
                autoPlay
                src={webcamSrc}
                className="recorded-video"
              />
            ) : null}
          </div>
          <div>
            <button className="submit" onClick={this.toggleRecord}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RecordPage;
