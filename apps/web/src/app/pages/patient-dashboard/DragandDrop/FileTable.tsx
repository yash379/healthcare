import React from 'react';
// import { FaFilePdf, FaFileWord, FaEllipsisV } from 'react-icons/fa'; // Icons from react-icons

interface FileData {
  fileName: string;
  fileType: 'pdf' | 'doc';
  labName: string;
  uploadTime: string;
  date: string;
  size: string;
}

const fileData: FileData[] = [
  {
    fileName: 'PDF product page presentation',
    fileType: 'pdf',
    labName: 'Dobrla Steph',
    uploadTime: '10:00',
    date: 'Nov 04, 2022',
    size: '20MB',
  },
  {
    fileName: 'Latest menu icons + instances',
    fileType: 'pdf',
    labName: 'Dobrla Steph',
    uploadTime: '11:00',
    date: 'Nov 04, 2022',
    size: '20MB',
  },
  {
    fileName: 'Terms and Conditions + Privacy Policy',
    fileType: 'doc',
    labName: 'Iulian Bildea',
    uploadTime: '12:50',
    date: 'Nov 01, 2022',
    size: '20MB',
  },
  {
    fileName: 'Logo variants',
    fileType: 'doc',
    labName: 'Ramone Jinga',
    uploadTime: '12:30',
    date: 'Oct 29, 2022',
    size: '20MB',
  },
  {
    fileName: 'Card icons',
    fileType: 'pdf',
    labName: 'Ramone Jinga',
    uploadTime: '13:50',
    date: 'Oct 29, 2022',
    size: '20MB',
  },
];

const FileTable: React.FC = () => {
  return (
    <div style={{ margin: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search product..."
          style={{
            width: '300px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <div style={{ paddingLeft: '20px' }}>
          <img src="/images/SearchBarSVG.svg" alt="" />
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '24px' }}>
              File Name
            </th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '24px' }}>
              Lab Name
            </th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '24px' }}>
              Upload Time
            </th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '24px' }}>
              Date
            </th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '24px' }}>
              Options
            </th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((file, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '18px', lineHeight: '50px' }}>
                {/* {file.fileType === 'pdf' ? <FaFilePdf style={{ color: 'red', marginRight: '10px' }} /> : <FaFileWord style={{ color: 'red', marginRight: '10px' }} />} */}
                {file.fileName} <span style={{ color: 'gray' }}>({file.size})</span>
              </td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '18px', lineHeight: '50px' }}>
                {file.labName}
              </td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '18px', lineHeight: '50px' }}>
                {file.uploadTime}
              </td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '18px', lineHeight: '50px' }}>
                {file.date}
              </td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#064B4F', fontSize: '18px', lineHeight: '50px' }}>
                {/* <FaEllipsisV style={{ cursor: 'pointer' }} /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
