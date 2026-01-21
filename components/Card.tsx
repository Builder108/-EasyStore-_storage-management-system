import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  created_at: string;
};

const Card = ({ file }: { file: FileItem }) => {
  const { type, extension } = getFileType(file.name);

  return (
    <div className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={type}
          extension={extension}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>

        <FormattedDateTime
          date={file.created_at}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          Stored in Supabase
        </p>
      </div>
    </div>
  );
};

export default Card;
