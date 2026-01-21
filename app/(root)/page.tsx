"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { convertFileSize, getUsageSummary, getFileType } from "@/lib/utils";

type FileItem = {
  id: string;
  name: string;
  storage_key: string;
  size: number;
  created_at: string;
  type: string;
};

const Dashboard = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(
        "http://localhost:5000/api/files?limit=10",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setFiles(data || []);
    };

    fetchDashboardData();
  }, []);

  /* ✅ SINGLE SOURCE OF TRUTH (FILES TABLE) */
  const usage = {
    documents: files
      .filter((f) => f.type === "document")
      .reduce((a, b) => a + (b.size || 0), 0),

    images: files
      .filter((f) => f.type === "image")
      .reduce((a, b) => a + (b.size || 0), 0),

    media: files
      .filter((f) => ["video", "audio"].includes(f.type))
      .reduce((a, b) => a + (b.size || 0), 0),

    others: files
      .filter((f) => f.type === "other")
      .reduce((a, b) => a + (b.size || 0), 0),
  };

  const totalUsed =
    usage.documents + usage.images + usage.media + usage.others;

  const usageSummary = getUsageSummary(usage);

  return (
    <div className="dashboard-container">
      {/* STORAGE */}
      <section>
        <Chart used={totalUsed} />

        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt={summary.title}
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size)}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* RECENT FILES */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">
          Recent files uploaded
        </h2>

        {files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file) => {
              const { type, extension } = getFileType(file.name);

              return (
                <li key={file.id} className="flex items-center gap-3">
                  <Thumbnail type={type} extension={extension} />

                  <div className="recent-file-details">
                    <div className="flex flex-col gap-1">
                      <p className="recent-file-name">{file.name}</p>
                      <FormattedDateTime
                        date={file.created_at}
                        className="caption"
                      />
                    </div>

                    <ActionDropdown file={file} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
