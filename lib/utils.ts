import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ----------------------------------
   Tailwind class helper
----------------------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ----------------------------------
   File type helpers
----------------------------------- */
export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const image = ["jpg", "jpeg", "png", "gif", "webp"];
  const video = ["mp4", "mov", "avi", "mkv"];
  const audio = ["mp3", "wav", "aac"];
  const document = ["pdf", "doc", "docx", "txt", "csv"];

  if (image.includes(extension)) return { type: "image", extension };
  if (video.includes(extension)) return { type: "video", extension };
  if (audio.includes(extension)) return { type: "audio", extension };
  if (document.includes(extension)) return { type: "document", extension };

  return { type: "other", extension };
};

/* ----------------------------------
   File icon resolver
----------------------------------- */
export const getFileIcon = (extension: string, type: string) => {
  if (type === "image") return "/assets/icons/file-image.svg";
  if (type === "video") return "/assets/icons/file-video.svg";
  if (type === "audio") return "/assets/icons/file-audio.svg";

  switch (extension) {
    case "pdf":
      return "/assets/icons/file-pdf.svg";
    case "doc":
    case "docx":
      return "/assets/icons/file-docx.svg";
    case "csv":
      return "/assets/icons/file-csv.svg";
    case "txt":
      return "/assets/icons/file-txt.svg";
    default:
      return "/assets/icons/file-other.svg";
  }
};

/* ----------------------------------
   File size formatter
----------------------------------- */
export const convertFileSize = (bytes: number) => {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

/* ----------------------------------
   Date formatter
----------------------------------- */
export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ----------------------------------
   File preview URL (upload)
----------------------------------- */
export const convertFileToUrl = (file: File) => {
  return URL.createObjectURL(file);
};

/* ----------------------------------
   Sort helper
----------------------------------- */
export const parseSortParam = (sort?: string) => {
  if (!sort) return { column: "created_at", ascending: false };

  const [column, order] = sort.split("-");
  return {
    column,
    ascending: order === "asc",
  };
};

/* ----------------------------------
   File type route resolver
----------------------------------- */
export const getFileTypesParams = (type: string) => {
  switch (type) {
    case "documents":
      return ["pdf", "doc", "docx", "txt", "csv"];
    case "images":
      return ["jpg", "jpeg", "png", "gif", "webp"];
    case "media":
      return ["mp4", "mov", "avi", "mkv", "mp3", "wav"];
    case "others":
      return [];
    default:
      return [];
  }
};

/* ----------------------------------
   Storage usage helpers
----------------------------------- */
export const calculatePercentage = (
  used: number,
  total = 2 * 1024 * 1024 * 1024
) => {
  if (!used || used <= 0) return 0;

  const percentage = (used / total) * 100;

  // ✅ Show at least 1% if space is used
  if (percentage > 0 && percentage < 1) return 1;

  return Math.round(percentage);
};


export const getUsageSummary = (totalSpace: {
  documents: number;
  images: number;
  media: number;
  others: number;
}) => {
  return [
    {
      title: "Documents",
      size: totalSpace.documents,
      icon: "/assets/icons/documents.svg",
      url: "/documents",
      latestDate: new Date().toISOString(),
    },
    {
      title: "Images",
      size: totalSpace.images,
      icon: "/assets/icons/images.svg",
      url: "/images",
      latestDate: new Date().toISOString(),
    },
    {
      title: "Media",
      size: totalSpace.media,
      icon: "/assets/icons/video.svg",
      url: "/media",
      latestDate: new Date().toISOString(),
    },
    {
      title: "Others",
      size: totalSpace.others,
      icon: "/assets/icons/others.svg",
      url: "/others",
      latestDate: new Date().toISOString(),
    },
  ];
};
