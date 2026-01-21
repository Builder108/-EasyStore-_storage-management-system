"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionsDropdownItems } from "@/constants";

type ActionType = {
  label: string;
  value: "rename" | "delete" | "download";
};

type FileItem = {
  id: string;
  name: string;
  storage_key: string; // ✅ FIXED
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const ActionDropdown = ({ file }: { file: FileItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const closeAll = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action || !token) return;
    setIsLoading(true);

    try {
      let res: Response | null = null;

      if (action.value === "rename") {
        res = await fetch(`${API_BASE}/api/files/rename`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: file.id,
            name,
          }),
        });
      }

      if (action.value === "delete") {
        res = await fetch(`${API_BASE}/api/files`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: file.id,
            storage_key: file.storage_key, // ✅ FIXED
          }),
        });
      }

      if (!res || !res.ok) {
        throw new Error("Action failed");
      }

      closeAll();
      window.location.reload(); // ✅ refresh UI safely
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!token) return;

    const res = await fetch(
      `${API_BASE}/api/files/download?storage_key=${encodeURIComponent(
        file.storage_key
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    window.open(data.signedUrl ?? data.url, "_blank");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="shad-dropdown-item"
              onClick={() => {
                if (item.value === "download") {
                  handleDownload();
                } else {
                  setAction(item as ActionType);
                  setIsModalOpen(true);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Image src={item.icon} alt={item.label} width={30} height={30} />
                {item.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {action && (
        <DialogContent className="shad-dialog">
          <DialogHeader>
            <DialogTitle>{action.label}</DialogTitle>
          </DialogHeader>

          {action.value === "rename" && (
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          )}

          {action.value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}

          <DialogFooter>
            <Button onClick={closeAll} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              {action.value}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ActionDropdown;
