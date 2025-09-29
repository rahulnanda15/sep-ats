import { useState, useEffect } from 'react';
import Webcam from '../components/Webcam';
import ApplicantAutocomplete from '../components/ApplicantAutocomplete';
import Airtable from 'airtable';
import {createClient } from '@supabase/supabase-js';
import './Photo.css';

interface PhotoProps {
  navigate?: (path: string) => void;
}

const Photo: React.FC<PhotoProps> = ({ navigate }) => {

  const currDay = "day_1";

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rusheeName, setRusheeName] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [isCheckingApplicant, setIsCheckingApplicant] = useState<boolean>(false);
  const [applicantExists, setApplicantExists] = useState<boolean>(false);
  const [applicantRecord, setApplicantRecord] = useState<any>(null);

  // Airtable configuration
  const base = new Airtable({
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
  }).base(import.meta.env.VITE_AIRTABLE_BASE_ID);
  
  // Supabase configuration
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL, 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  async function uploadFile(imageDataUrl: string, fileName: string): Promise<string | null> {
    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
      
      // Upload to Supabase storage
      const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`${fileName}-${Date.now()}.png`, file);
      
      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      console.log('File uploaded successfully:', data);
      console.log('Public URL:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  }
  // Check if applicant exists and has photo
  const checkApplicant = async (name: string) => {
    setIsCheckingApplicant(true);
    try {
      const records = await base('Applicants').select({
        filterByFormula: `{applicant_name} = "${name}"`,
        maxRecords: 1
      }).all();
      

      if (records.length > 0) {
        const record = records[0];
        const photoField = record.get('photo');
        const yearField = record.get('year');
        
        console.log('Applicant name:', name);
        console.log('Record found:', record);
        console.log('Photo field raw:', photoField);
        console.log('Year field raw:', yearField);
        console.log('Photo field type:', typeof photoField);
        console.log('Is photo field truthy:', !!photoField);
        console.log('Is photo field not empty string:', photoField !== '');
        
        // Set the year from the existing record
        if (yearField) {
          setSelectedYear(yearField.toString());
        }
        
        // Check if photo field exists and is not empty
        if (photoField && photoField !== '' && photoField.toString().trim() !== '') {
          // Applicant exists and has photo - go to check-in success screen
          setApplicantExists(true);
          setApplicantRecord(record);
          
          // Update attendance for existing applicant
            try {
              await base('Applicants').update(record.id, {
                [currDay]: true
              });
            } catch (error) {
            console.error('Error updating attendance:', error);
          }
          
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setRusheeName('');
            setSelectedYear('');
            setApplicantExists(false);
            setApplicantRecord(null);
          }, 2000);
        } else {
          // Applicant exists but no photo - add/update record and take photo
          setApplicantExists(true);
          setApplicantRecord(record);
          setShowWebcam(true);
        }
      } else {
        // Applicant doesn't exist - will create new record when photo is taken
        setApplicantExists(false);
        setApplicantRecord(null);
        setShowWebcam(true);
      }
    } catch (error) {
      console.error('Error checking applicant:', error);
      alert('Error checking applicant. Please try again.');
    } finally {
      setIsCheckingApplicant(false);
    }
  };

  // Handle submit button click
  const handleSubmit = (name: string) => {
    if (name.trim() === '') {
      alert('Please enter a rushee name');
      return;
    }
    if (selectedYear === '') {
      alert('Please select a year');
      return;
    }
    checkApplicant(name.trim());
  };

  const capturePhoto = () => {
    setIsCapturing(true);
    
    // Get the video element from the webcam component
    const video = document.querySelector('.webcam-video') as HTMLVideoElement;
    
    if (video && video.srcObject) {
      // Create a canvas to capture the frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
      }
    }
    
    setIsCapturing(false);
  };

  const savePhoto = async () => {
    if (capturedImage) {
      try {
        // Upload photo to Supabase and get public URL
        const publicUrl = await uploadFile(capturedImage, rusheeName);
        
        if (!publicUrl) {
          alert('Error uploading photo. Please try again.');
          return;
        }
        
        // Update Airtable with the Supabase public URL and mark attendance
        if (applicantExists && applicantRecord) {
          // Update existing record
          await base('Applicants').update(applicantRecord.id, {
            'photo': publicUrl,
            'year': parseInt(selectedYear),
            [currDay]: true
          });
        } else {
          // Create new record
          await base('Applicants').create({
            'applicant_name': rusheeName,
            'photo': publicUrl,
            'year': parseInt(selectedYear),
            'status': 'Ongoing',
            [currDay]: true
          });
        }
        
        // Show success animation
        setShowSuccess(true);
        
        // Reset everything after 2 seconds
        setTimeout(() => {
          setCapturedImage(null);
          setShowSuccess(false);
          setShowWebcam(false);
          setRusheeName('');
          setSelectedYear('');
          setApplicantExists(false);
          setApplicantRecord(null);
        }, 2000);
        
      } catch (error) {
        console.error('Error saving to Airtable:', error);
        alert('Error saving to database. Please try again.');
      }
    }
  };

  const closeModal = () => {
    setCapturedImage(null);
  };

  const handleBack = () => {
    setShowWebcam(false);
    // Keep the rushee name so it appears in the input field
    setApplicantExists(false);
    setApplicantRecord(null);
  };

  const handleApplicantSelect = (applicant: { id: string; name: string }) => {
    // When an applicant is selected from autocomplete, automatically check them
    setRusheeName(applicant.name);
    // Trigger the check process (this will also set the year from the record)
    checkApplicant(applicant.name.trim());
  };

  return (
    <div className="photo-page">
      <div className="photo-header">
        <h1>📸 Rush Check-In</h1>
      </div>

      <div className="photo-content">
        <div className="webcam-section">
          {!showWebcam ? (
            <div className="input-section">
              <label className="input-label">
                Applicant Name:
              </label>
              <div className="input-with-button">
                <ApplicantAutocomplete
                  value={rusheeName}
                  onChange={setRusheeName}
                  onSelect={handleApplicantSelect}
                  placeholder="Enter applicant name"
                  disabled={isCheckingApplicant}
                />
                <button 
                  onClick={() => handleSubmit(rusheeName)}
                  disabled={isCheckingApplicant || rusheeName.trim() === '' || selectedYear === ''}
                  className="submit-icon-button"
                >
                  {isCheckingApplicant ? '⟳' : '→'}
                </button>
              </div>
              
              <label className="input-label">
                Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={isCheckingApplicant}
                className="year-dropdown"
              >
                <option value="">Select Year</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
          ) : (
            <div className="rushee-display">
              <button 
                onClick={handleBack}
                className="back-button"
              >
                ←
              </button>
              <div className="rushee-name-display">
                {rusheeName}
              </div>
            </div>
          )}

          {showWebcam && (
            <div className="webcam-capture-container">
              <Webcam 
                width={window.innerWidth <= 768 ? 320 : 500} 
                height={window.innerWidth <= 768 ? 240 : 375} 
                autoStart={true} 
              />
              <button 
                onClick={capturePhoto}
                disabled={isCapturing}
                className="capture-button"
                title={isCapturing ? 'Capturing...' : 'Capture Photo'}
              >
              </button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{rusheeName}</h2>
                <button className="close-button" onClick={closeModal}>
                  ✕
                </button>
              </div>
              <div className="photo-preview">
                <img 
                  src={capturedImage} 
                  alt="Captured photo" 
                  className="captured-image"
                />
              </div>
              <div className="photo-actions">
                <button onClick={savePhoto} className="download-button">
                  💾 Check In
                </button>
              </div>
              
              {showSuccess && (
                <div className="success-overlay">
                  <div className="success-checkmark">
                    ✓
                  </div>
                  <div className="success-text">
                    Check In Successful!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success screen for existing applicants with photos */}
        {showSuccess && !capturedImage && (
          <div className="success-screen">
            <div className="success-content">
              <div className="success-checkmark">
                ✓
              </div>
              <div className="success-text">
                {rusheeName} is checked in!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photo;