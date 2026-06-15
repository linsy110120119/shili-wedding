const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images', 'cases', '\u7ea2\u8272\u7cfb\u5217');
const allFiles = fs.readdirSync(dir);

(async () => {
  // Step 1: Find original source files (prefer .jpeg originals, then .jpg for 14-23)
  const sources = {};
  for (const f of allFiles) {
    const match = f.match(/^(\d+)_/);
    if (!match) continue;
    const num = match[1];
    if (f.endsWith('.jpeg')) {
      sources[num] = f; // .jpeg are originals for 01-13
    } else if (f.endsWith('.jpg') && !sources[num]) {
      sources[num] = f; // .jpg for 14-23 (no .jpeg original)
    }
  }

  let totalOut = 0;
  for (const num of Object.keys(sources).sort()) {
    const srcFile = sources[num];
    const fp = path.join(dir, srcFile);
    const buf = fs.readFileSync(fp);

    const out = await sharp(buf)
      .resize(900, null, { withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true })
      .toBuffer();

    // Always output as .jpg with original name pattern
    const baseName = srcFile.replace(/\.jpe?g$/, '');
    const outFile = baseName + '.jpg';
    fs.writeFileSync(path.join(dir, outFile), out);
    totalOut += out.length;

    const oldKB = Math.round(buf.length / 1024);
    const newKB = Math.round(out.length / 1024);
    console.log(srcFile + ' -> ' + outFile + ': ' + oldKB + 'KB -> ' + newKB + 'KB');

    // Delete the .jpeg original if it's different from output
    if (srcFile.endsWith('.jpeg')) {
      fs.unlinkSync(fp);
    }
  }
  console.log('\nTotal output: ' + Math.round(totalOut / 1024) + 'KB');
  console.log('Done!');
})();
