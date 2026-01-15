
/**
 * Triggers a browser download for a remote file.
 * Note: Cross-origin restrictions might prevent the browser from 
 * using the 'download' attribute for renaming. 
 * For a truly robust downloader, one would fetch as blob first.
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to direct link opening if fetch fails (e.g. CORS)
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    link.click();
  }
};
