import React, { useState } from 'react'
import DragNDrop from '../DragandDrop/DragNDrop'
import FileTable from '../DragandDrop/FileTable';

interface FileData {
  fileName: string;
  labName: string;
  uploadTime: string;
  date: string;
  size: string;
}

function MedicalReport() {
  const [files, setFiles] = useState<FileData[]>([]);

  const handleFilesUploaded = (uploadedFiles: FileData[]) => {
    setFiles(uploadedFiles);
  };
  
  return (
    <div style={{width:'98%'}}>
      <DragNDrop onFilesUploaded={handleFilesUploaded}/>
      <FileTable files={files}/>
    </div>
  )
}

export default MedicalReport
