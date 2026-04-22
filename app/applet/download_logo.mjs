import fs from 'fs';

async function downloadLogo() {
  try {
    // Using the raw.githubusercontent.com URL format which is safer for direct binary downloads
    const url = "https://raw.githubusercontent.com/AlbertPrince/SST_Client/main/public/SSt%20Logo%20FinalbyPrince.png";
    const res = await fetch(url);
    if (!res.ok) {
       // fallback to original URL structure if raw routing fails
       console.log("Trying fallback URL...");
       const fallbackRes = await fetch("https://github.com/AlbertPrince/SST_Client/blob/main/public/SSt%20Logo%20FinalbyPrince.png?raw=true");
       if (!fallbackRes.ok) throw new Error(`HTTP error! status: ${fallbackRes.status}`);
       const buffer = await fallbackRes.arrayBuffer();
       if (!fs.existsSync('public')) fs.mkdirSync('public', { recursive: true });
       fs.writeFileSync("public/logo.png", Buffer.from(buffer));
       console.log("Successfully downloaded and saved public/logo.png via fallback");
       return;
    }
    
    const buffer = await res.arrayBuffer();
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }
    fs.writeFileSync("public/logo.png", Buffer.from(buffer));
    console.log("Successfully downloaded and saved public/logo.png");
  } catch (error) {
    console.error("Download failed:", error);
  }
}

downloadLogo();
