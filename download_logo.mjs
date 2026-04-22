import fs from 'fs';

async function downloadLogo() {
  try {
    const url = "https://github.com/AlbertPrince/SST_Client/blob/main/public/SSt%20Logo%20FinalbyPrince.png?raw=true";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const buffer = await res.arrayBuffer();
    // make sure public exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync("public/logo.png", Buffer.from(buffer));
    console.log("Successfully downloaded and saved public/logo.png");
  } catch (error) {
    console.error("Download failed:", error);
  }
}

downloadLogo();
