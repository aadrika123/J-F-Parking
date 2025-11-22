import toast from "react-hot-toast";

export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 2 * 1024 * 1024, // 2MB default
    allowedTypes = ['image/*', '.pdf'],
    checkMalicious = true
  } = options;

  if (!file) {
    toast.error("No file selected");
    return false;
  }

  // Check file size
  if (file.size > maxSize) {
    toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
    return false;
  }

  // Check if file is empty or corrupted
  if (file.size === 0) {
    toast.error("File is empty or corrupted");
    return false;
  }

  if (checkMalicious) {
    // Check for dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar', '.js', '.vbs', '.ps1', '.msi', '.dll'];
    const fileName = file.name.toLowerCase();
    const hasDangerousExt = dangerousExtensions.some(ext => fileName.endsWith(ext));
    
    if (hasDangerousExt) {
      toast.error("Malicious file type detected! Please upload only image or PDF files.");
      return false;
    }

    // Validate file content
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = function() {
        toast.error("Error reading file. File may be corrupted.");
        resolve(false);
      };
      
      reader.onload = function(e) {
        try {
          const arrayBuffer = e.target.result;
          const bytes = new Uint8Array(arrayBuffer);
          
          if (bytes.length < 4) {
            toast.error("File is too small or corrupted");
            resolve(false);
            return;
          }
          
          const header = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Check PDF files
          if (fileName.endsWith('.pdf')) {
            // Valid PDF should start with %PDF
            if (header !== '25504446') {
              toast.error("Invalid PDF file format or corrupted PDF");
              resolve(false);
              return;
            }
            
            // Check for PDF trailer
            const textContent = new TextDecoder('latin1').decode(arrayBuffer);
            if (!textContent.includes('%%EOF')) {
              toast.error("Corrupted PDF file - missing end marker");
              resolve(false);
              return;
            }
            
            // Check for suspicious content in PDF
            const suspiciousPatterns = ['/JS', '/JavaScript', '/AA', '/OpenAction', '/Launch', '/EmbeddedFile', '/XFA'];
            if (suspiciousPatterns.some(pattern => textContent.includes(pattern))) {
              toast.error("Potentially harmful PDF detected! File contains suspicious executable content.");
              resolve(false);
              return;
            }
          }
          
          // Check image files
          if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
            const imageHeaders = {
              'ffd8ff': 'JPEG',
              '89504e47': 'PNG',
              '47494638': 'GIF',
              '424d': 'BMP',
              '52494646': 'WEBP'
            };
            
            const fileHeader = header.substring(0, 8);
            const shortHeader = header.substring(0, 4);
            
            if (!imageHeaders[fileHeader] && !imageHeaders[shortHeader]) {
              toast.error("Invalid image file format or corrupted image");
              resolve(false);
              return;
            }
          }
          
          resolve(true);
        } catch (error) {
          toast.error("Error validating file. File may be corrupted.");
          resolve(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  return true;
};