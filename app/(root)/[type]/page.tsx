"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";

import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  created_at: string;
};

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const type = (params?.type as string) || "";
  const searchText = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "";

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const types = getFileTypesParams(type);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/files?types=${types.join(
          ","
        )}&search=${searchText}&sort=${sort}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setFiles(data);
      setLoading(false);
    };

    fetchFiles();
  }, [type, searchText, sort]);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total:{" "}
            <span className="h5">
              {files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024} MB
            </span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {loading ? (
        <p className="empty-list">Loading...</p>
      ) : files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => (
            <Card key={file.id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
