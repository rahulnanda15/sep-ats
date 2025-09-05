# 📸  ATS System

A modern web application for managing check-ins during SEP Recruitment. This system allows applicants to check in by taking a photo, which is then stored securely and linked to their applicant record.

## 🎯 What This System Does

### For Applicants
- **Easy Check-In**: Simply enter your name and take a photo to check in
- **Photo Capture**: Uses your device's camera to take a professional headshot
- **Instant Confirmation**: Get immediate feedback when check-in is successful
- **No Account Required**: Check in without creating an account or password

### For Recruitment Chairs/Administrators
- **Automated Photo Collection**: Automatically captures and stores applicant photos
- **Database Integration**: All check-ins are stored in Airtable for easy management
- **Photo Storage**: Images are securely stored in Supabase cloud storage
- **Duplicate Prevention**: System checks if applicant already exists and has a photo

## 🚀 Features

### Smart Check-In Workflow
1. **Name Entry**: Applicant enters their name in a simple form
2. **Automatic Verification**: System checks if applicant exists in the database
3. **Conditional Photo Capture**: 
   - If applicant exists with photo → Shows success screen
   - If applicant exists without photo → Prompts for photo
   - If new applicant → Prompts for photo
4. **Photo Upload**: Captured photos are automatically uploaded to cloud storage
5. **Database Update**: Applicant record is updated with photo URL

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Webcam Integration**: Uses device camera for photo capture
- **Cloud Storage**: Photos stored securely in Supabase
- **Database Management**: Airtable integration for applicant records
- **Environment Variables**: Secure API key management
- **Modern UI**: Clean, intuitive interface with success animations

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with responsive design
- **Database**: Airtable (applicant records)
- **Storage**: Supabase (photo storage)
- **Camera**: Browser MediaDevices API
- **Routing**: Custom client-side routing

## 📱 How It Works

### For Applicants
1. **Navigate to Check-In**: Click the "📸 Check In" button
2. **Enter Name**: Type your full name in the input field
3. **Submit**: Click "Submit" to check your status
4. **Take Photo** (if needed): Use the camera to take your photo
5. **Check In**: Click "Check In" to complete the process
6. **Success**: See confirmation that you're checked in!

### For Administrators
- **View Records**: All check-ins appear in your Airtable database
- **Photo Management**: Photos are stored in Supabase with public URLs
- **Data Export**: Export data from Airtable for further processing

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Airtable account with API key
- Supabase account with storage bucket

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ats-app.git
   cd ats-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Airtable Configuration
   VITE_AIRTABLE_API_KEY=your_airtable_api_key
   VITE_AIRTABLE_BASE_ID=your_airtable_base_id
   
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_BUCKET_NAME=your_bucket_name
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

### Airtable Table: "Applicants"
- **applicant_name**: Text field for applicant's name
- **photo**: URL field containing Supabase photo URL

### Supabase Storage
- **Bucket**: Configured bucket for photo storage
- **File Naming**: `{applicantName}-{timestamp}.png`
- **Access**: Public URLs for easy viewing

## 🔒 Security Features

- **Environment Variables**: All API keys stored securely
- **Git Ignore**: Sensitive files excluded from version control
- **Public Storage**: Photos stored with public access for easy viewing
- **Input Validation**: Form validation prevents empty submissions

## 📱 Mobile Optimization

- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Camera Access**: Works with mobile device cameras
- **Fast Loading**: Optimized for mobile networks

## 🎨 User Interface

### Design Principles
- **Clean & Modern**: Minimalist design focused on usability
- **Intuitive Navigation**: Clear buttons and logical flow
- **Visual Feedback**: Success animations and loading states
- **Accessibility**: High contrast and readable fonts

### Key Components
- **Navigation Bar**: Easy switching between pages
- **Input Form**: Simple name entry with validation
- **Webcam Interface**: Live camera feed with capture button
- **Photo Modal**: Preview captured photo before submission
- **Success Screen**: Confirmation of successful check-in

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables in deployment settings
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common issues

## 🔄 Future Enhancements

- **Bulk Upload**: Support for multiple photo uploads
- **Photo Editing**: Basic photo editing capabilities
- **Analytics**: Check-in statistics and reporting
- **Notifications**: Email/SMS confirmations
- **QR Code**: QR code generation for easy access

---
