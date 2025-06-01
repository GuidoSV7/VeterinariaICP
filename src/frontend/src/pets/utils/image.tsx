import Compressor from "compressorjs";

export function arrayBufferToImgSrc(arrayBuffer: ArrayBuffer, imgType: string = "jpeg"): string {
  const byteArray = new Uint8Array(arrayBuffer);
  const picBlob = new Blob([byteArray], { type: `image/${imgType}` });
  const picSrc = URL.createObjectURL(picBlob);
  return picSrc;
}

async function readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function fileToCanisterBinaryStoreFormat(file: File): Promise<number[]> {
  const arrayBuffer = await readFileToArrayBuffer(file);
  return Array.from(new Uint8Array(arrayBuffer));
}

const DefaultMaxWidth = 768;

// Helper function to convert Blob to File
const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now()
  });
};

export const resizeImage = async (file: File, maxWidth?: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.5,
      maxWidth: maxWidth || DefaultMaxWidth,
      mimeType: "image/jpeg",
      success(result: File | Blob) {
        // Ensure we always return a File
        if (result instanceof File) {
          resolve(result);
        } else if (result instanceof Blob) {
          // Convert Blob to File
          const convertedFile = blobToFile(result, file.name || 'resized-image.jpg');
          resolve(convertedFile);
        } else {
          reject(new Error('Invalid result from Compressor'));
        }
      },
      error(err: Error) {
        reject(err);
      }
    });
  });
};