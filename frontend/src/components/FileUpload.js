// src/components/FileUploadDialog.js

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SHA256 from "crypto-js/sha256";

const FileUploadDialog = ({ open, onClose, user_id, onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [phrase, setPhrase] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileType = selectedFile.type;

      if (fileType.startsWith("image")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else if (fileType.startsWith("application/pdf")) {
        setPreview("PDF file selected.");
      } else if (fileType.startsWith("text")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsText(selectedFile);
      } else if (
        fileType.startsWith("application/msword") ||
        fileType.startsWith(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ) {
        setPreview("DOC/DOCX file selected.");
      }
    }
  };

  const handleFileUpload = async () => {
  if (!file) {
    setStatus("No file selected.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", user_id);
  formData.append("phrase", SHA256(phrase).toString());

  try {
    // Use await to make sure the request completes before checking the response
    const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Check if the upload was successful
    if (response.status === 201) {
      setStatus("File uploaded successfully!");
      setFile(null);
      setPreview("");
      setPhrase("");
      onUpload();
      onClose();

      // Redirect to upload-in-progress page
      navigate("/upload-in-progress");
    } else {
      setStatus("File upload failed.");
    }
  } catch (error) {
    // Handle specific error messages based on response
    if (error.response && error.response.status === 405) {
      setErrorDialogOpen(true); // Open the error dialog if status code is 405
    } else {
      setStatus("Error uploading file: " + (error.response ? error.response.statusText : error.message));
    }
  }
};

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0 }}>
            Enter your Password or Phrase for the file:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="phrase"
              label="Phrase"
              type="password"
              id="phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              sx={{ mt: 2 }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="*/*"
              />
            </Button>
            {file && (
              <Card sx={{ mt: 2, maxWidth: 400 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    File Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {file.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Type:</strong> {file.type}
                  </Typography>
                </CardContent>
                {preview && (
                  <CardMedia
                    component={file.type.startsWith("image") ? "img" : "div"}
                    image={preview}
                    sx={{ height: file.type.startsWith("image") ? 200 : "auto" }}
                  />
                )}
              </Card>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleFileUpload}
              sx={{ mt: 2 }}
            >
              Upload
            </Button>
            {status && (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                {status}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog for Duplicate File */}
      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="error">
            The same file exists. Please upload a different file.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileUploadDialog;
