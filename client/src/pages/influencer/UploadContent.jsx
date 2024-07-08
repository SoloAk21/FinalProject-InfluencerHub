import React, { useState } from "react";
import { Card, Button, Textarea, Alert } from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import { MdCancel } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { postToAuthAPI } from "../../helper/postToAuthAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UploadContent() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { campaignId, companyId } = location.state || {};
  const { currentUser } = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file: file,
      description: "",
      type: getFileType(file.type),
      preview:
        file.type.startsWith("image/") || file.type.startsWith("video/")
          ? URL.createObjectURL(file)
          : null,
    }));
    setFiles([...files, ...newFiles]);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const getFileType = (type) => {
    if (type.startsWith("image/")) {
      return "image";
    } else if (type.startsWith("audio/")) {
      return "audio";
    } else if (type.startsWith("video/")) {
      return "video";
    } else {
      return "";
    }
  };

  const handleDescriptionChange = (index, value) => {
    const updatedFiles = [...files];
    updatedFiles[index].description = value;
    setFiles(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (
      files.length === 0 ||
      files.some((file) => !file.description || !file.type)
    ) {
      setUploadError(
        "Please select file(s), add description, and ensure file type(s) are supported (image, audio, or video)."
      );
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const uniqueFilename = `${uuidv4()}_${file.file.name}`;
        const storageRef = ref(storage, `${file.type}/${uniqueFilename}`);
        await uploadBytes(storageRef, file.file);
        const fileURL = await getDownloadURL(storageRef);

        const contents = [
          {
            type: file.type,
            description: file.description,
            url: fileURL,
            uploadedAt: new Date().toISOString(),
          },
        ];

        const response = await postToAuthAPI("/api/contents/create", {
          influencerId: currentUser._id,
          companyId,
          campaignId,
          contents,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload content`);
        }

        return fileURL;
      });

      await Promise.all(uploadPromises);

      setFiles([]);
      setUploadSuccess("Files uploaded successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (error) {
      console.error("Error uploading file(s):", error);
      setUploadError("Failed to upload file(s). Please try again later.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-[550px]" color="transparent" shadow={false}>
      {uploadError && (
        <Alert
          color="red"
          className="rounded-none w-full bg-red-100 font-medium"
          open={open}
          onClose={() => setUploadError(null)}
        >
          <span className="block sm:inline">{uploadError}</span>
          <MdCancel
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setUploadError(null)}
          />
        </Alert>
      )}

      {uploadSuccess && (
        <Alert
          color="green"
          className="rounded-none w-full bg-green-500 font-medium"
          open={open}
          onClose={() => setUploadSuccess(null)}
        >
          <span className="block sm:inline">{uploadSuccess}</span>
          <MdCancel
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setUploadSuccess(null)}
          />
        </Alert>
      )}

      <div className="py-6 px-9">
        <div className="mb-6 pt-4">
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Upload File
          </label>

          <div className="mb-8">
            <input
              type="file"
              name="file"
              id="file"
              className="sr-only"
              multiple
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className="relative flex min-h-[200px] items-center justify-center rounded-md border bg-gray-100 border-dashed border-[#e0e0e0] p-12 text-center"
            >
              <div>
                <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                  Drop files here
                </span>
                <span className="mb-2 block text-base font-medium text-[#6B7280]">
                  Or
                </span>
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  Browse
                </span>
              </div>
            </label>
          </div>

          {files.map((file, index) => (
            <div key={index} className="mb-5 rounded-md">
              <div className="flex items-center justify-between">
                <Alert
                  className="rounded-none w-full bg-gray-400 font-medium"
                  open={open}
                  onClose={() => handleRemoveFile(index)}
                >
                  {file.file.name}
                  <MdCancel
                    className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  />
                </Alert>
              </div>

              <div className="flex items-center mt-0 justify-between">
                {file.preview && file.type === "image" && (
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                )}
                {file.preview && file.type === "video" && (
                  <video
                    className="w-full h-auto rounded-lg"
                    controls
                    src={file.preview}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <Textarea
                placeholder="Description"
                value={file.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="mt-3 w-full"
              />
            </div>
          ))}
        </div>

        <div>
          <Button
            onClick={handleUpload}
            color="gray"
            buttonType="filled"
            size="regular"
            rounded={false}
            block={true}
            iconOnly={false}
            ripple="light"
            className="hover:shadow-form w-full capitalize py-3 px-8 text-center m-auto text-base font-semibold text-white outline-none"
            disabled={uploading || files.some((file) => !file.description)}
            loading={uploading}
          >
            Submit Content
          </Button>
        </div>
      </div>
    </Card>
  );
}
