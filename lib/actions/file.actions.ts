import type { GetFilesProps } from "@/types";

const API_BASE_URL = "http://localhost:5000/api/files";

/* ----------------------------- */
/* Helper: Get auth token        */
/* ----------------------------- */
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

/* ----------------------------- */
/* GET FILES (list + search)     */
/* ----------------------------- */
export async function getFiles({
  types = [],
  searchText = "",
  sort = "",
  limit,
}: GetFilesProps) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams();

  if (types.length) params.append("types", types.join(","));
  if (searchText) params.append("search", searchText);
  if (sort) params.append("sort", sort);
  if (limit) params.append("limit", String(limit));

  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch files");
  }

  return res.json();
}

/* ----------------------------- */
/* UPLOAD FILE                   */
/* ----------------------------- */
export async function uploadFile(file: File) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}

/* ----------------------------- */
/* RENAME FILE                   */
/* ----------------------------- */
export async function renameFile({
  fileId,
  name,
}: {
  fileId: string;
  name: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/rename`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: fileId, name }),
  });

  if (!res.ok) {
    throw new Error("Rename failed");
  }

  return res.json();
}

/* ----------------------------- */
/* DELETE FILE                   */
/* ----------------------------- */
export async function deleteFile({
  id,
  path,
}: {
  id: string;
  path: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, path }),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.json();
}

/* ----------------------------- */
/* DOWNLOAD FILE (signed URL)    */
/* ----------------------------- */
export async function downloadFile(path: string) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${API_BASE_URL}/download?path=${encodeURIComponent(path)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Download failed");
  }

  return res.json();
}
