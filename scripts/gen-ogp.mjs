// OGP画像(1200x630 PNG)を public/ogp.png に生成する。
// SVGを組み、Astro同梱のsharpでPNGへラスタライズする。
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/ogp.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f0fafa"/>
  <rect x="0" y="0" width="1200" height="16" fill="#2c7a7b"/>
  <rect x="0" y="614" width="1200" height="16" fill="#2c7a7b"/>
  <g transform="translate(96 250) scale(3.4)">
    <g transform="rotate(-40 16 16)">
      <rect x="5" y="12.5" width="22" height="9" rx="4.5" fill="#2c7a7b"/>
      <rect x="16" y="12.5" width="11" height="9" rx="4.5" fill="#5fb0b1"/>
      <rect x="15.2" y="12.5" width="1.6" height="9" fill="#ffffff"/>
    </g>
  </g>
  <g font-family="'Yu Gothic','Meiryo','MS Gothic','Hiragino Sans',sans-serif">
    <text x="232" y="296" font-size="86" font-weight="700" fill="#1a5d5e">くすりの株ノート</text>
    <text x="236" y="372" font-size="40" font-weight="700" fill="#2b2b2b">医療セクターの配当・優待データベース</text>
    <text x="236" y="430" font-size="31" fill="#4a4a4a">薬剤師 × FP2級 × 医療法人事務長の視点</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg), { density: 144 })
  .png()
  .toFile(out);

console.log('wrote', out);
