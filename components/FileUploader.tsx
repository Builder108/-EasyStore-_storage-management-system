"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Thumbnail from "@/components/Thumbnail";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";

interface Props {
  className?: string;
}

const FileUploader = ({ className }: Props) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      toast({
        description: "You must be logged in to upload files",
        className: "error-toast",
      });
      return;
    }

    setFiles((prev) => [...prev, ...acceptedFiles]);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));

        toast({
          description: `${file.name} is too large. Max size is 50MB.`,
          className: "error-toast",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:5000/api/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Upload failed");
        }

        setFiles((prev) => prev.filter((f) => f.name !== file.name));
      } catch (err: any) {
        toast({
          description: err.message || `Failed to upload ${file.name}`,
          className: "error-toast",
        });
      }
    });

    await Promise.all(uploadPromises);
  }, [toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />

      <Button type="button" className={cn("uploader-button", className)}>
        <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
