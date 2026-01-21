import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";

interface HeaderProps {
  userId: string;
  accountId: string;
}

const Header = ({ userId, accountId }: HeaderProps) => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/sign-in";
  };

  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />

        <Button
          type="button"
          className="sign-out-button"
          onClick={handleLogout}
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="logout"
            width={24}
            height={24}
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
