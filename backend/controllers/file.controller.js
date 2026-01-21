import { supabase } from "../supabaseClient.js";

const resolveFileType = (mime) => {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  // PDFs, docs, txt, csv, etc.
  if (mime.startsWith("application/") || mime.startsWith("text/")) {
    return "document";
  }

  return "other";
};
/* =====================================================
   UPLOAD FILE (BUCKET + TABLE)
===================================================== */
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Unique storage path
    const storageKey = `${user.id}/${Date.now()}-${file.originalname}`;

    /* 1️⃣ Upload to Supabase STORAGE bucket */
    const { data, error } = await supabase.storage
      .from("files")
      .upload(storageKey, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    /* 2️⃣ Insert METADATA into files TABLE */
    const { error: dbError } = await supabase.from("files").insert({
      name: file.originalname,
      storage_key: data.path,          // ✅ IMPORTANT
      size: file.size,
      owner_id: user.id,               // FK → public.users.id
      type: resolveFileType(file.mimetype), // image | video | audio | other
    });

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    res.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

/* =====================================================
   LIST FILES (FILTER + SORT)
===================================================== */
export const listFiles = async (req, res) => {
  try {
    const user = req.user;
    const { type, sort, limit } = req.query;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let query = supabase
      .from("files")
      .select("*")
      .eq("owner_id", user.id);

    /* ✅ CATEGORY FILTER */
    if (type === "images") {
      query = query.eq("type", "image");
    }

    if (type === "media") {
      query = query.in("type", ["video", "audio"]);
    }

    if (type === "documents") {
      query = query.eq("type", "document");
    }

    if (type === "others") {
      query = query.eq("type", "other");
    }

    /* ✅ SORT */
    if (sort) {
      const [column, order] = sort.split("-");

      const columnMap = {
        name: "name",
        size: "size",
        "$createdAt": "created_at",
      };

      if (columnMap[column]) {
        query = query.order(columnMap[column], {
          ascending: order === "asc",
        });
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    /* ✅ LIMIT (Dashboard recent files) */
    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load files" });
  }
};

/* =====================================================
   DELETE FILE (BUCKET + TABLE)
===================================================== */
export const deleteFile = async (req, res) => {
  try {
    const { id, storage_key } = req.body;
    const user = req.user;

    if (!id || !storage_key) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await supabase.storage.from("files").remove([storage_key]);
    await supabase
      .from("files")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

/* =====================================================
   DOWNLOAD FILE (SIGNED URL)
===================================================== */
export const downloadFile = async (req, res) => {
  try {
    const { storage_key } = req.query;

    if (!storage_key) {
      return res.status(400).json({ error: "Missing storage_key" });
    }

    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(storage_key, 60);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
};

/* =====================================================
   RENAME FILE (TABLE ONLY)
===================================================== */
export const renameFile = async (req, res) => {
  try {
    const { id, name } = req.body;
    const user = req.user;

    if (!id || !name) {
      return res.status(400).json({ error: "Missing id or name" });
    }

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("files")
      .update({ name })
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Rename failed" });
  }
};

/* ===============================
   STORAGE USAGE (DASHBOARD FIX)
================================ */
export const getStorageUsage = async (req, res) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔑 IMPORTANT: Sum from TABLE (single source of truth)
    const { data, error } = await supabase
      .from("files")
      .select("size")
      .eq("owner_id", user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // ✅ CORRECT TOTAL
    const used = data.reduce((total, file) => total + (file.size || 0), 0);

    res.json({ used });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate usage" });
  }
};

