const sharp = require('sharp');
async function run() {
  const img = sharp('src/assets/female day 1.png');
  const svg = `
    <svg width="1414" height="2000">
      <circle cx="722" cy="1010" r="210" stroke="red" stroke-width="5" fill="none" />
      <circle cx="707" cy="1090" r="255" stroke="blue" stroke-width="5" fill="none" />
    </svg>
  `;
  await img.composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
           .toFile('../../brain/c8f46100-9c85-4583-baef-ecd4643bb77b/test_circle2.png');
  console.log('done');
}
run().catch(console.error);
