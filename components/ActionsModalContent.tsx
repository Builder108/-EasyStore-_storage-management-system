import React from "react";

import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, getFileType } from "@/lib/utils";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  created_at: string;
};

const ImageThumbnail = ({ file }: { file: FileItem }) => {
  const { type, extension } = getFileType(file.name);

  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={type} extension={extension} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormattedDateTime date={file.created_at} className="caption" />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: FileItem }) => {
  const { extension } = getFileType(file.name);

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={extension || "N/A"} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow
          label="Uploaded:"
          value={new Date(file.created_at).toLocaleString()}
        />
      </div>
    </>
  );
};
