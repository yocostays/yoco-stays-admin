
// utils/fileDownloader.ts
export const downloadFile = async (url, fileName, body = {}, token) => {
  try {
    // Call your backend API
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to fetch file from backend");

    const blob = await res.blob();
    const fileURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Download failed:", error);
  }
};



