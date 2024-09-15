import React from 'react'
import DragNDrop from '../DragandDrop/DragNDrop'
import FileTable from '../DragandDrop/FileTable'

function MedicalReport() {
  return (
    <div style={{width:'98%'}}>
      <DragNDrop/>
      <FileTable/>
    </div>
  )
}

export default MedicalReport
