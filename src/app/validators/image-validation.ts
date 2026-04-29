/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
export function validateRealImageType(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    // Solo leemos los primeros 4 bytes (suficiente para JPG y PNG)
    const blob = file.slice(0, 4);

    reader.onloadend = (e: any) => {
      if (e.target.readyState !== FileReader.DONE) return;

      const uint = new Uint8Array(e.target.result);
      const bytes: string[] = [];
      uint.forEach((byte) => {
        bytes.push(byte.toString(16).padStart(2, "0"));
      });
      const header = bytes.join("");

      const isJPG = header.startsWith("ffd8ff");
      const isPNG = header === "89504e47";

      resolve(isJPG || isPNG);
    };

    reader.readAsArrayBuffer(blob);
  });
}
