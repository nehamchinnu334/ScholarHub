import { 
  FileText, 
  Table, 
  Play, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  FolderSearch, 
  UploadCloud,
  LayoutDashboard
} from 'lucide-react';

export { 
  FileText as Article, 
  Table as TableChart, 
  Play as Slideshow, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  FolderSearch as FolderShared, 
  UploadCloud,
  LayoutDashboard
};

export const PictureAsPdf = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h3a2 2 0 0 0 0-4H9v4Z"/><path d="M15 11v4h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1Z"/>
  </svg>
);
