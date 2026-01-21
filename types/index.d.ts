/* eslint-disable no-unused-vars */

export type FileType =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "other";

/* ----------------------------------
   Generic types
----------------------------------- */
export interface ActionType {
  label: string;
  icon: string;
  value: "rename" | "delete" | "download" | "details";
}

export interface SearchParamProps {
  params?: { type?: string };
  searchParams?: { [key: string]: string | undefined };
}

/* ----------------------------------
   File (Supabase DB)
----------------------------------- */
export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  created_at: string;
}

/* ----------------------------------
   API Props
----------------------------------- */
export interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}

export interface RenameFileProps {
  id: string;
  name: string;
}

export interface DeleteFileProps {
  id: string;
  path: string;
}

/* ----------------------------------
   Components Props
----------------------------------- */
export interface FileUploaderProps {
  className?: string;
}

export interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

export interface MobileNavigationProps {
  fullName: string;
  avatar: string;
  email: string;
}

export interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
}
