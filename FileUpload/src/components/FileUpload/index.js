import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";

import * as DocumentPicker from "react-native-document-picker";
import * as mime from "react-native-mime-types";

/* helpers ----------------------------------------------------------------- */
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const buildBlobUrl = (containerSasUrl, fileName) => {
  const [base, query] = containerSasUrl.split("?");
  return `${base}/${encodeURIComponent(fileName)}?${query}`;
};

const putToAzure = (fileObj, sasUrl, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", sasUrl);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

    xhr.upload &&
      (xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded / e.total);
      });

    xhr.onload = () =>
      xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fileObj);
  });

/* main component ----------------------------------------------------------- */
export default function FileUpload(props) {
  const {
    allowMultiple,
    acceptedExtensions,
    maxFileSizeMB,
    containerSasUrl,
    onFileUploaded,
    onFileRemoved,
    borderColor = "#d0d0d0",
    progressColor = "#007aff",
  } = props;

  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  /* ---------------------------- validation -------------------------------- */
  const extWhitelist = acceptedExtensions
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const validateFile = (f) => {
    if (extWhitelist.length) {
      const okExt = extWhitelist.some((e) => f.name.toLowerCase().endsWith(e));
      if (!okExt) throw new Error("Invalid extension");
    }
    if (maxFileSizeMB && f.size / (1024 * 1024) > maxFileSizeMB) {
      throw new Error("File too large");
    }
  };

  /* --------------------------- pick / paste ------------------------------- */
  const openNativePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: allowMultiple,
      });
      const picked = Array.isArray(res) ? res : [res];
      handleFiles(picked);
    } catch (_) {}
  };

  const triggerWebPicker = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFiles = (fileList) => {
    fileList.forEach(async (f) => {
      try {
        validateFile(f);
      } catch (e) {
        alert(`${f.name}: ${e.message}`);
        return;
      }

      /* add optimistic entry */
      const id = `${Date.now()}-${f.name}`;
      setFiles((prev) => [
        ...prev,
        { id, file: f, progress: 0, uploading: true },
      ]);

      try {
        const sasUrl = buildBlobUrl(containerSasUrl, f.name);
        await putToAzure(f, sasUrl, (p) =>
          setFiles((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, progress: p } : item
            )
          )
        );

        const fileUrl = sasUrl.split("?")[0]; // public URL (without token)
        setFiles((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, uploading: false, url: fileUrl } : item
          )
        );

        /* fire Adalo action */
        onFileUploaded &&
          onFileUploaded(
            fileUrl,
            f.name,
            f.size,
            f.type || mime.lookup(f.name)
          );
      } catch (err) {
        setFiles((prev) => prev.filter((item) => item.id !== id));
        alert(`Upload failed for ${f.name}: ${err.message}`);
      }
    });
  };

  /* copy-paste handling (web only) */
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onPaste = (e) => {
      const pastedFiles = Array.from(e.clipboardData.files || []);
      if (pastedFiles.length) handleFiles(pastedFiles);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  });

  /* drag-&-drop (web) */
  const dropHandlers =
    Platform.OS === "web"
      ? {
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => {
            e.preventDefault();
            handleFiles(Array.from(e.dataTransfer.files));
          },
        }
      : {};

  /* remove / delete -------------------------------------------------------- */
  const deleteFile = async (item) => {
    setFiles((prev) => prev.filter((f) => f.id !== item.id));
    onFileRemoved && onFileRemoved(item.url, item.file.name);
    try {
      await fetch(item.url + "?" + containerSasUrl.split("?")[1], {
        method: "DELETE",
      });
    } catch (_) {}
  };

  /* render ----------------------------------------------------------------- */
  const styles = StyleSheet.create({
    wrapper: {
      borderWidth: 1,
      borderColor,
      borderStyle: "dashed",
      borderRadius: 6,
      padding: 12,
      width: "100%",
    },
    browseArea: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
    },
    browseText: { fontSize: 15, color: "#555" },
    fileRow: { marginTop: 8 },
    meta: { flexDirection: "row", justifyContent: "space-between" },
    progressTrack: {
      height: 4,
      backgroundColor: "#e5e5e5",
      borderRadius: 2,
      overflow: "hidden",
      marginTop: 4,
    },
    progressBar: (p) => ({
      height: 4,
      backgroundColor: progressColor,
      width: `${p * 100}%`,
    }),
    remove: { color: "#ff3b30", fontWeight: "600" },
  });

  return (
    <View {...dropHandlers}>
      {/* hidden web input */}
      {Platform.OS === "web" && (
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          multiple={allowMultiple}
          accept={acceptedExtensions}
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      )}

      <Pressable
        style={styles.wrapper}
        onPress={Platform.OS === "web" ? triggerWebPicker : openNativePicker}
      >
        <View style={styles.browseArea}>
          <Text style={styles.browseText}>
            {Platform.OS === "web"
              ? "Browse… or drop files here"
              : "Tap to choose file(s)"}
          </Text>
        </View>

        {/* file list */}
        <ScrollView>
          {files.map((item) => (
            <View key={item.id} style={styles.fileRow}>
              <View style={styles.meta}>
                <Text numberOfLines={1} style={{ flex: 1 }}>
                  {item.file.name}
                </Text>
                <Text style={{ marginLeft: 6, fontVariant: ["tabular-nums"] }}>
                  {bytesToMB(item.file.size)} MB
                </Text>
                <Pressable onPress={() => deleteFile(item)}>
                  <Text style={styles.remove}>🗑️</Text>
                </Pressable>
              </View>

              {item.uploading ? (
                <View style={styles.progressTrack}>
                  <View style={styles.progressBar(item.progress)} />
                </View>
              ) : (
                <Text style={{ color: "#28a745", marginTop: 4 }}>
                  ✔ Uploaded
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </Pressable>
    </View>
  );
}
