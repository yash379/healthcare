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

const DragNDrop: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const reports = [
        { fileName: 'PDF product page presentation', labName: 'Dobria Steph', uploadTime: '10:00', date: 'Nov 04, 2022' },
        { fileName: 'Latest menu icons & instances', labName: 'Dobria Steph', uploadTime: '11:00', date: 'Nov 04, 2022' },
        { fileName: 'Terms and Conditions + Privacy Policy', labName: 'Iulian Bildea', uploadTime: '12:50', date: 'Nov 01, 2022' },
    ];

    const filteredReports = reports.filter(report =>
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.mainContent}>
            <div style={styles.uploadSection}>
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