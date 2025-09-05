import { useState, useRef, useEffect } from 'react';
import './Webcam.css';

interface WebcamProps {
  width?: number;
  height?: number;
  className?: string;
  autoStart?: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ 
  width = 320, 
  height = 240, 
  className = '',
  autoStart = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startWebcam = async () => {
    try {
      setError(null);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please check permissions.');
      setHasPermission(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const toggleWebcam = () => {
    if (isStreaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  // Auto-start webcam if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startWebcam();
    }
  }, [autoStart]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className={`webcam-container ${className}`}>
      <div className="webcam-box">
        <video
          ref={videoRef}
          width={width}
          height={height}
          autoPlay
          playsInline
          muted
          className="webcam-video"
        />
        
        {!isStreaming && !error && !autoStart && (
          <div className="webcam-placeholder">
            <p>Click to start webcam</p>
          </div>
        )}
        
        {!isStreaming && !error && autoStart && (
          <div className="webcam-placeholder">
            <p>Starting camera...</p>
          </div>
        )}
        
        {error && (
          <div className="webcam-error">
            <p>{error}</p>
          </div>
        )}
      </div>
      
      {!autoStart && (
        <div className="webcam-controls">
          <button 
            onClick={toggleWebcam}
            className={`webcam-button ${isStreaming ? 'stop' : 'start'}`}
          >
            {isStreaming ? 'Stop Camera' : 'Start Camera'}
          </button>
          
          {hasPermission === false && (
            <p className="permission-hint">
              Please allow camera access in your browser settings
            </p>
          )}
        </div>
      )}
      
      {autoStart && hasPermission === false && (
        <div className="webcam-controls">
          <p className="permission-hint">
            Please allow camera access in your browser settings
          </p>
        </div>
      )}
    </div>
  );
};

export default Webcam;
