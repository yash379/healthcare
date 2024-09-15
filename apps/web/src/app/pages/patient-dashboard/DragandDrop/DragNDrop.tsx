import { colors } from '@mui/material';
import React, { useState } from 'react';
import { text } from 'stream/consumers';

// Table Row component
interface TableRowProps {
    fileName: string;
    labName: string;
    uploadTime: string;
    date: string;
}

interface FileData {
    fileName: string;
    labName: string;
    uploadTime: string;
    date: string;
    size: string;
  }

const TableRow: React.FC<TableRowProps> = ({ fileName, labName, uploadTime, date }) => {
    return (
        <tr style={styles.tableRow}>
            <td>{fileName}</td>
            <td>{labName}</td>
            <td>{uploadTime}</td>
            <td>{date}</td>
        </tr>
    );
};

const DragNDrop: React.FC <{ onFilesUploaded: (files: FileData[]) => void }>= ({ onFilesUploaded }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

    const reports = [
        { fileName: 'PDF product page presentation', labName: 'Dobria Steph', uploadTime: '10:00', date: 'Nov 04, 2022' },
        { fileName: 'Latest menu icons & instances', labName: 'Dobria Steph', uploadTime: '11:00', date: 'Nov 04, 2022' },
        { fileName: 'Terms and Conditions + Privacy Policy', labName: 'Iulian Bildea', uploadTime: '12:50', date: 'Nov 01, 2022' },
    ];

    const filteredReports = reports.filter(report =>
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
        const currentFiles: FileData[] = Array.from(files).map((file) => ({
            fileName: file.name,
            labName: 'Default Lab', // You can modify this based on user input or other logic
            uploadTime: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            size: `${(file.size / 1024).toFixed(2)} KB`, // File size in KB
        }));

        // Update local state and pass to parent component
        setUploadedFiles(currentFiles);
        onFilesUploaded(currentFiles); // Pass the uploaded files to the parent
        }
    };

    return (
        <div style={styles.mainContent}>
      <div style={styles.uploadSection}>
        <input type="file" multiple onChange={handleFileUpload} />
        <img src="/images/uploadSVG.svg" alt="Description of image" />
        <span style={styles.dragDropSpan}>
          <br />
          Drag and drop your files here
          <br />
          or click to upload (up to 10 files)
        </span>
      </div>
    </div>
    );
};


const styles = {
    dragDropSpan:{
        color: '#064B4F',
        fontSize: '34px' as const,
    },
    mainContent: {
        // width: '100%',
        padding: '5% 0px 0px 0px',
        boxSizing: 'border-box' as const,
    },
    uploadSection: {
        border: '2px dashed #064B4F',
        padding: '5%',
        textAlign: 'center' as const,
        marginBottom: '20px',
    },
    searchBar: {
        width:'30%',
        marginBottom: '20px',
        textAlign: 'center' as const,     
    },
    searchInput: {
        // width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
    },
    tableRow: {
        borderBottom: '2% solid #ddd',
    },
};

export default DragNDrop;

