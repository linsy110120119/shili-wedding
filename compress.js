const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images', 'cases', '\u7ea2\u8272\u7cfb\u5217');
const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

(async () => {
  let totalBefore = 0, totalAfter = 0;
  for (const file of files) {
    const fp = path.join(dir, file);
    const buf = fs.readFileSync(fp);
    totalBefore += buf.length;
    
    const out = await sharp(buf)
      .resize(500, null, { withoutEnlargement: true })
      .jpeg({ quality: 60, progressive: true })
      .toBuffer();
    
    totalAfter += out.length;
    const oldName = path.parse(file).name;
    const newName = oldName + '.jpg';
    fs.writeFileSync(path.join(dir, newName), out);
    
    const oldKB = Math.round(buf.length / 1024);
    const newKB = Math.round(out.length / 1024);
    console.log(file + ' -> ' + newName + ': ' + oldKB + 'KB -> ' + newKB + 'KB');
  }
  console.log('\nTotal: ' + Math.round(totalBefore/1024) + 'KB -> ' + Math.round(totalAfter/1024) + 'KB');
  console.log('Done! ' + files.length + ' images compressed.');
})();
