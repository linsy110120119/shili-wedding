const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');
const heroFiles = ['hero-1.png', 'hero-2.png', 'hero-3.png'];

(async () => {
  for (const file of heroFiles) {
    const fp = path.join(imgDir, file);
    if (!fs.existsSync(fp)) { console.log('Skip: ' + file); continue; }
    const buf = fs.readFileSync(fp);
    const oldMB = (buf.length / 1024 / 1024).toFixed(1);

    const out = await sharp(buf)
      .resize(1400, null, { withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    const outFile = file.replace('.png', '.jpg');
    fs.writeFileSync(path.join(imgDir, outFile), out);
    const newKB = Math.round(out.length / 1024);
    console.log(file + ' (' + oldMB + 'MB) -> ' + outFile + ' (' + newKB + 'KB)');

    // Delete old PNG
    fs.unlinkSync(fp);
  }
  console.log('Done!');
})();
