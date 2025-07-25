import { useEffect, useState } from "react";
import { FiArchive, FiFile, FiFileText, FiImage, FiPenTool, FiVideo } from "react-icons/fi";

// Function to get file icon and color based on file extension
export const getFileIconAndColor = (fileExtension: string, mimeType?: string) => {
  const extension = fileExtension?.toLowerCase().replace('.', '') || '';
  
  // Image files
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension) || 
      mimeType?.startsWith('image/')) {
    return { 
      icon: <FiImage size={24} />, 
      type: 'image',
      bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30'
    };
  }
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension) || 
      mimeType?.startsWith('video/')) {
    return { 
      icon: <FiVideo size={24} />, 
      type: 'video',
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-500/30'
    };
  }
  
  // Document files
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension) || 
      mimeType?.includes('pdf') || mimeType?.includes('document')) {
    return { 
      icon: <FiFileText size={24} />, 
      type: 'document',
      bgColor: 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/30'
    };
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension) || 
      mimeType?.includes('zip') || mimeType?.includes('archive')) {
    return { 
      icon: <FiArchive size={24} />, 
      type: 'archive',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/30'
    };
  }
  
  // Design files
  if (['sketch', 'fig', 'psd', 'ai', 'xd'].includes(extension)) {
    return { 
      icon: <FiPenTool size={24} />, 
      type: 'design',
      bgColor: 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-pink-500/30'
    };
  }
  
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv', 'ods'].includes(extension) || 
      mimeType?.includes('spreadsheet')) {
    return { 
      icon: <FiFileText size={24} />, 
      type: 'spreadsheet',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500 shadow-green-500/30'
    };
  }
  
  // Default for unknown files
  return { 
    icon: <FiFile size={24} />, 
    type: 'file',
    bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30'
  };
};

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const getRemainingDays = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInMs = targetDate.getTime() - today.getTime();

  return Math.ceil(diffInMs / msPerDay);
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function useIsTabletOrSmaller(): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsTablet(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isTablet;
}