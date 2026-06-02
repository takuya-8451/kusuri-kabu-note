// データ鮮度チェック（A1/A3・半自動方式）
// 銘柄md(frontmatter)の asOfDate を監視し、更新が必要な銘柄を報告する。
// 値の自動取得・上書きは一切行わない（運営者がIRで検証した翌期フォワード値＝堀を保全するため）。
// 依存なし（Node標準モジュールのみ）。CIから実行し、出力をGitHub Issueへ集約する。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STALE_DAYS = 90; // 配当予想は四半期更新が目安。これを超えたら更新推奨。

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src', 'content', 'stocks');

const field = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};

const today = new Date();
const stale = [];
const missingAsOf = [];
const missingYield = [];

for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(path.join(dir, f), 'utf8');
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];
  const ticker = field(fm, 'ticker');
  const name = field(fm, 'name');
  const hasYield = !!field(fm, 'dividendYield');
  const asOf = field(fm, 'asOfDate');
  const label = `${name ?? ''}（${ticker ?? f}）`;

  if (!hasYield) { missingYield.push(label); continue; }
  if (!asOf) { missingAsOf.push(label); continue; }
  const ageDays = Math.floor((today - new Date(asOf)) / 86400000);
  if (ageDays > STALE_DAYS) stale.push(`${label} — ${asOf}（${ageDays}日前）`);
}

const section = (title, items, emptyMsg) =>
  `## ${title}：${items.length}件\n${items.length ? items.map((s) => `- ${s}`).join('\n') : `- ${emptyMsg}`}`;

const report = [
  `# 📊 データ鮮度レポート（${today.toISOString().slice(0, 10)} 自動生成）`,
  '',
  '> 値の自動上書きは行いません。下記の銘柄はIRで翌期予想を確認のうえ、該当mdの `dividendYield` / `asOfDate` を更新してください。',
  '',
  section(`⏰ 更新推奨（asOfDateが${STALE_DAYS}日超）`, stale, 'なし（すべて新鮮）'),
  '',
  section('❓ 利回りありだが時点(asOfDate)未設定', missingAsOf, 'なし'),
  '',
  section('➖ 配当利回り未設定（データ拡充候補）', missingYield, 'なし'),
  '',
].join('\n');

writeFileSync(path.join(root, 'data-freshness-report.md'), report);
console.log(report);
console.log(`\nACTION_NEEDED=${stale.length + missingAsOf.length}`);
