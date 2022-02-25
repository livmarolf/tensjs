import * as coco from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"
import React, { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"
import "./App.css"
import { drawDetections } from "./utilities"

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const createDetector = (net, video, ctx) => async () => {
    // Clear canvas
    canvasRef.current.width = video.videoWidth
    canvasRef.current.height = video.videoHeight

    const obj = await net.detect(video)

    // Draw mesh
    drawDetections(obj, ctx)
  }

  useEffect(() => {
    webcamRef.current.video.addEventListener("loadeddata", async () => {
      const net = await coco.load()
      setLoaded(true)

      const video = webcamRef.current.video
      webcamRef.current.video.width = video.videoWidth
      webcamRef.current.video.height = video.videoHeight

      const runDetector = createDetector(
        net,
        video,
        canvasRef.current.getContext("2d")
      )

      const loop =  () => runDetector().then(() => requestAnimationFrame(loop))      

      loop()
    })
  }, [webcamRef])

  const styles = {
    position: "absolute",
    width: 640,
    height: 480,
    opacity: loaded ? 1 : 0.5,
    animation: loaded ? "none" : "loading 1s ease infinite",
    transition: "all 0.2s ease",
  }

  return (
    <div className="App">
      <Webcam ref={webcamRef} muted={true} style={styles} />
      <canvas ref={canvasRef} style={styles} />
    </div>
  )
}

export default App
