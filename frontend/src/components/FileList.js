// src/FileList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  PhotoCamera,
  Description,
  Image,
  FilePresent,
  Download,
  Delete,
} from "@mui/icons-material";
import {
  PictureAsPdf as FileIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  TextFields as TextIcon,
  Code as CodeIcon,
  InsertDriveFile as DefaultFileIcon,
} from "@mui/icons-material";
import SHA256 from "crypto-js/sha256";

const getFileTypeIcon = (type) => {
  if (type.includes("image")) return <ImageIcon />;
  if (type.includes("video")) return <VideoIcon />;
  if (type.includes("audio")) return <AudioIcon />;
  if (type.includes("text")) return <TextIcon />;
  if (type.includes("application") && type.includes("pdf")) return <FileIcon />;
  if (type.includes("application") && type.includes("code"))
    return <CodeIcon />;
  return <DefaultFileIcon />;
};

const FileList = ({ user_id, refresh }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  // Function to check if the file is an image
  const isImage = (file) => file.type.startsWith("image/");

  // Function to get the appropriate icon based on the file type
  const getFileIcon = (file) => {
    if (isImage(file)) {
      return (
        <Avatar sx={{ bgcolor: "transparent" }}>
          <Image />
        </Avatar>
      );
    } else if (file.type.startsWith("application/pdf")) {
      return (
        <Avatar sx={{ bgcolor: "transparent" }}>
          <Description />
        </Avatar>
      );
    } else if (file.type.startsWith("text/")) {
      return (
        <Avatar sx={{ bgcolor: "transparent" }}>
          <FilePresent />
        </Avatar>
      );
    } else {
      return (
        <Avatar sx={{ bgcolor: "transparent" }}>
          <Description />
        </Avatar>
      );
    }
  };

  const fetchItems = () => {
    axios
      .post(
        "http://127.0.0.1:8000/files_list",
        { user_id: user_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Assuming the response data is an array of files
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Function to handle file download
  const handleDownload = (fileName) => {
    const phrase = prompt("Enter the phrase to download this file:");
    axios
      .post(
        "download",
        {
          user_id: user_id,
          fileName: fileName,
          phrase: SHA256(phrase).toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob", // Important
        }
      )
      .then((response) => {
        // Create a link element, set its href to the blob URL, and click it
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  // Function to handle file download
  const handleDelete = (fileName) => {
    axios
      .post(
        "delete",
        {
          user_id: user_id,
          fileName: fileName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Create a link element, set its href to the blob URL, and click it
        console.log(response);
        fetchItems();
      })
      .catch((error) => {
        console.error("Error Deleting file:", error);
      });
  };

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          List of Uploaded Files
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Icon</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Size (bytes)</TableCell>
                <TableCell>Last Modfied At</TableCell>
                <TableCell>Download</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{getFileTypeIcon(file.type)}</TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>
                    {new Date(file.last_modified).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Download File">
                      <IconButton onClick={() => handleDownload(file.name)}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(file.name)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default FileList;
