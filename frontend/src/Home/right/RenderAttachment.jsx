import React from 'react'
import { transformImage } from '../../lib/features';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
function RenderAttachment(file, url) {
  switch (file) {
    case "video":
      return <video src={url} width="200px"></video>
      
    case "image":
      return <img src={transformImage(url, 200)} alt='Attachment' width={"200px"} height={"150px"} style={{objectFit: "contain"}}/>
  
    case "audio": 
      return <audio src={url} preload='none' controls/>
    default:
      return <InsertDriveFileIcon sx={{ fontSize: 100 }} />
  }
}

export default RenderAttachment