import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import useSendMessage from '../../context/useSendMessage';
import axios from 'axios';
import Lottie from 'lottie-react';
import animationData from '../../assets/sending.json'
import toast from 'react-hot-toast';
import useConversation from '../../stateManage/useConversation';
import useSendGroupMessage from '../../context/useSendGroupMessage';
import server from '../../environment.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '35%',
  transform: 'translate(-25%, -20%)',
  width: '25vw',
  height: '50vh',
  bgcolor: '#111827',
  boxShadow: 24,
  overflow: 'auto',
  p: 2,
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function FileUploadModal({ open, onClose, onSend }) {
  const [file, setFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [textFieldVal, setTextFieldVal] = React.useState('');
  const { sendMessage } = useSendMessage();
  const [loading, setLoading] = React.useState(false);
  const { selectedConversation } = useConversation();
  const { sendGroupMessage } = useSendGroupMessage();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile && selectedFile.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl('');
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setPreviewUrl('');
  };

  const handleSendFile = async () => {
    if (!file) return toast.error("Please select a file!");

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const res = await axios.post(
        `${server}/upload`,
        formData,
        { withCredentials: true }
      );

      console.log(res.data.dataURL);
      const attachmentUrl = res.data.dataURL;
      const attachmentMessage = textFieldVal || "";
      const attachment = [{ attachmentUrl, attachmentMessage }]
      const message = "";
      if (selectedConversation.username) {
        sendMessage(message, attachment);
      } else {
        sendGroupMessage(message, attachment);
      }

      setLoading(false);
      onClose(true);
    } catch (err) {
      console.log(err);
      setLoading(false);
      onClose(true);
    }



    setFile(null);

  }



  const renderPreview = () => {
    if (!file) return null;

    return (
      <Box display="flex" flexDirection="column" gap={1}>
        {file.type.startsWith('image/') && (
          <img
            src={previewUrl}
            alt="preview"
            style={{ borderRadius: 8 }}
          />
        )}
        {file.type.startsWith('video/') && (
          <video
            controls
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: 8 }}
          >
            <source src={previewUrl} type={file.type} />
            Your browser does not support the video tag.
          </video>
        )}
        {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
          <Box display="flex" alignItems="center" gap={1}>
            <InsertDriveFileIcon sx={{ color: 'white' }} />
            <Typography variant="body2">{file.name}</Typography>
          </Box>
        )}

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancelFile}
          sx={{ alignSelf: 'flex-start' }}
        >
          Cancel
        </Button>
      </Box>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>

        {
          loading ? (<div className='flex items-center justify-center bg-gray-900 h-full'>
            <div style={{ width: 350, height: 350 }}>
              <Lottie
                animationData={animationData}
                loop
                autoplay
              />
            </div>
          </div>) : (
            <>
              <Typography variant="h6">Upload File</Typography>

              <Button
                variant="contained"
                component="label"
                sx={{ bgcolor: '#1f2937' }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {renderPreview()}

              <TextField
                label="Description (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                sx={{
                  input: { color: 'white' },
                  textarea: { color: 'white' },
                  label: { color: 'gray' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'gray' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                }}
                onChange={(e) => setTextFieldVal(e.target.value)}
              />

              <Button variant="contained" color="primary"
                onClick={handleSendFile}
              >
                Send
              </Button>
            </>
          )
        }

      </Box>
    </Modal>
  );
}
