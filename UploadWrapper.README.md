# Upload Wrapper Documentation

## Overview

The `UploadWrapper` provides a universal upload solution that can be used from any component in your application. It includes:

- ✅ Progress tracking with visual notifications
- ✅ Concurrent upload management
- ✅ File validation (size, type)
- ✅ Error handling
- ✅ Theme-matching UI notifications
- ✅ Drag & drop support
- ✅ Customizable upload logic

## Basic Usage

```tsx
import { useUploadWrapper } from '../components/UploadWrapper';

const MyComponent = () => {
  const { uploadFiles, notification } = useUploadWrapper({
    onUploadComplete: (fileId, result) => {
      console.log('File uploaded:', result);
    }
  });

  const handleFileSelect = (files: FileList | null) => {
    if (files) uploadFiles(files);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileSelect(e.target.files)} />
      {notification}
    </div>
  );
};
```

## Customizing Upload Logic

### 1. Current Upload Implementation

The upload wrapper is now configured for your specific workflow:

**3-Step Upload Process:**
1. **Temporary Storage**: Uploads via your backend proxy at `/api/cdn/upload-0x0/` (which forwards to 0x0.st)
2. **CDN Upload**: Uses the temp URL to upload to HackClub CDN API
3. **Backend Save**: Saves file metadata to your backend at `/api/cdn/files/upload/`

**Current Implementation:**

The upload process automatically:
- ✅ Extracts `folder_id` from current URL (e.g., `/dashboard/my-cdn/specific_folder_id`)
- ✅ Generates MD5 and SHA256 hashes of the file
- ✅ Handles all three upload steps with progress tracking
- ✅ Provides comprehensive error handling

**Important Notes:**
- Uses your backend proxy `/api/cdn/upload-0x0/` to avoid CORS issues
- MD5 hash uses SHA-1 fallback (consider using crypto-js for true MD5)
- Bearer token is currently hardcoded as "beans" - update as needed

```tsx
// EXAMPLE ALTERNATIVE IMPLEMENTATION:
const uploadFileToServer = async (file: File, onProgress: (progress: number) => void): Promise<any> => {
  // Your actual upload implementation here
  
  const formData = new FormData();
  formData.append('file', file);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Progress tracking
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });
    
    // Success handler
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });
    
    // Error handler
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });
    
    // Start upload
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
};
```

### 2. Alternative Upload Implementations

#### Using Fetch with Progress (requires additional setup)

```tsx
const uploadFileToServer = async (file: File, onProgress: (progress: number) => void): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Note: Fetch doesn't support upload progress natively
  // You'll need a library like 'fetch-progress' or use XMLHttpRequest
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return await response.json();
};
```

#### Using Axios with Progress

```tsx
import axios from 'axios';

const uploadFileToServer = async (file: File, onProgress: (progress: number) => void): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(progress);
      }
    },
  });
  
  return response.data;
};
```

#### Using AWS S3 Direct Upload

```tsx
import AWS from 'aws-sdk';

const uploadFileToServer = async (file: File, onProgress: (progress: number) => void): Promise<any> => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });
  
  const params = {
    Bucket: 'your-bucket-name',
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
  };
  
  return new Promise((resolve, reject) => {
    const upload = s3.upload(params);
    
    upload.on('httpUploadProgress', (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      onProgress(percent);
    });
    
    upload.send((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
```

### 3. Configuration Options

```tsx
const { uploadFiles, notification } = useUploadWrapper({
  // Maximum file size in bytes (default: 50MB)
  maxFileSize: 100 * 1024 * 1024, // 100MB
  
  // Allowed file types (empty array = all types allowed)
  allowedFileTypes: [
    'image/*',           // All images
    'application/pdf',   // PDFs
    '.doc', '.docx',     // Word documents
    '.txt'               // Text files
  ],
  
  // Maximum concurrent uploads (default: 3)
  maxConcurrentUploads: 5,
  
  // Event handlers
  onUploadStart: (files: FileList) => {
    console.log(`Starting upload of ${files.length} files`);
  },
  
  onUploadProgress: (fileId: string, progress: number) => {
    console.log(`File ${fileId} is ${progress}% complete`);
  },
  
  onUploadComplete: (fileId: string, result: any) => {
    console.log('Upload successful:', result);
    // Update your UI, refresh file list, etc.
  },
  
  onUploadError: (fileId: string, error: string) => {
    console.error('Upload failed:', error);
    // Handle error, show user message, etc.
  },
  
  onAllUploadsComplete: (results: any[]) => {
    console.log('All uploads finished:', results);
    // Redirect, refresh page, show success message, etc.
  },
});
```

### 4. Return Values

The hook returns:

```tsx
const {
  uploadFiles,      // Function to start uploads: (files: FileList) => void
  currentUploads,   // Array of current upload states
  notification,     // JSX element to render notifications
  isUploading      // Boolean indicating if any uploads are active
} = useUploadWrapper();
```

### 5. Styling Customization

The notification component uses Tailwind classes that match your site's green theme. To customize:

1. **Colors**: Modify the color classes in the `getStatusColor()` function
2. **Position**: Change `bottom-6 right-6` to position elsewhere
3. **Size**: Adjust `max-w-sm` for notification width
4. **Animation**: Modify transition classes for different effects

### 6. Backend Integration

Your backend endpoint should:

1. Accept `multipart/form-data` requests
2. Return JSON with file information
3. Handle errors appropriately

Example Express.js endpoint:

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    // Process file, save to CDN, etc.
    
    res.json({
      url: `https://your-cdn.com/uploads/${file.filename}`,
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Current Upload Flow

Your upload wrapper now handles this complete workflow:

1. **File Selection** → User selects files via input or drag & drop
2. **Validation** → Checks file size and type restrictions
3. **Temp Upload** → Uploads via `/api/cdn/upload-0x0/` proxy (Progress: 0-33%)
4. **CDN Upload** → Sends temp URL to HackClub CDN (Progress: 33-66%)
5. **Backend Save** → Stores file metadata in your database (Progress: 66-100%)
6. **Completion** → Shows success notification with final CDN URL

**Data Sent to Your Backend:**
```json
{
  "filename": "1_d926bfd9811ebfe9172187793a171a5cbcc61992_flag-orpheus-left.png",
  "original_filename": "my-image.png", 
  "cdn_url": "https://hc-cdn.hel1.your-objectstorage.com/s/v3/d926bfd9811e...",
  "file_size": 8126,
  "mime_type": "image/png",
  "md5_hash": "d41d8cd98f00b204e9800998ecf8427e",
  "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "folder_id": "8b1bfd48-d233-4967-ac96-fd8915ed1a2c" // specific folder ID or root folder ID
}
```

**Folder ID Handling:**
- URL: `/dashboard/my-cdn/photos/vacation` → `folder_id: "photos/vacation"`
- URL: `/dashboard/my-cdn` → fetches root folder ID from `/api/cdn/folders/root/`
- URL: `/dashboard/other-page` → fetches root folder ID from `/api/cdn/folders/root/`

When no specific folder is detected in the URL, the system automatically fetches the root folder ID to ensure files are always associated with a valid folder.

## Examples

See `UploadExample.tsx` for complete working examples including:
- Simple file upload
- Image-only upload with drag & drop
- Document upload with custom validation
- Programmatic upload without UI

## Backend Endpoint Requirements

**Required Backend Endpoints:**

1. **`/api/cdn/upload-0x0/`** - For temporary file uploads via 0x0.st proxy
2. **`/api/cdn/folders/root/`** - For fetching root folder information
3. **`/api/cdn/files/upload/`** - For saving final file metadata

### 1. Temporary Upload Proxy Endpoint:

```javascript
// Backend proxy route for 0x0.st uploads
app.post('/api/cdn/upload-0x0/', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    
    const response = await fetch('https://0x0.st', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`0x0.st upload failed: ${response.statusText}`);
    }
    
    const tempUrl = await response.text();
    
    // Option 1: Return as plain text (simpler)
    res.type('text/plain').send(tempUrl.trim());
    
    // Option 2: Return as JSON (more structured)
    // res.json({ 
    //   tempUrl: tempUrl.trim(),
    //   success: true 
    // });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
});
```

**Expected Response Format:**
Your endpoint can return either:

**Option 1: Plain text (direct URL):**
```
https://0x0.st/abc123.txt
```

**Option 2: JSON format:**
```json
{
  "tempUrl": "https://0x0.st/abc123.txt",
  "success": true
}
```

The upload wrapper automatically detects and handles both formats.

### 2. Root Folder Endpoint:

**`GET /api/cdn/folders/root/`** - Returns root folder information

**Expected Response:**
```json
{
  "root_folder": {
    "id": "8b1bfd48-d233-4967-ac96-fd8915ed1a2c",
    "name": "Root",
    "parent": null,
    "owner": 1,
    "owner_detail": {
      "id": 1,
      "username": "khaledmuhmmed99@gmail.com",
      "email": "khaledmuhmmed99@gmail.com",
      "full_name": "Khaled Muhammad Ibrahim",
      "profile_picture": "https://avatars.slack-edge.com/..."
    },
    "path": "Root",
    "is_root": true,
    "children_count": 0,
    "files_count": 0,
    "full_path": "Root",
    "created_at": "2025-07-22T11:55:16.815070Z",
    "updated_at": "2025-07-22T11:55:16.815134Z"
  },
  "folders": [],
  "files": []
}
```

The upload wrapper uses the `root_folder.id` value as the folder_id when no specific folder is detected in the URL. 