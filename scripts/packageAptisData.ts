import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = path.resolve('aptis_data/aptisprep_dataset');
const outputRoot = path.resolve('public/aptis-media');
const allowedSkills = new Set(['reading', 'listening', 'speaking', 'writing']);
const samples: Record<string, unknown>[] = [];
const mediaPaths = new Set<string>();

for (const line of fs.readFileSync(path.join(sourceRoot, 'normalized/questions.jsonl'), 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  const row = JSON.parse(line);
  if (!allowedSkills.has(row.skill)) continue;
  const media = (row.media ?? []).map((item: { local_path?: string; type?: string }) => {
    if (!item.local_path) return null;
    const relative = item.local_path.replaceAll('\\', '/');
    const filename = path.posix.basename(relative);
    mediaPaths.add(relative);
    return { type: item.type, path: `/aptis-media/${filename}` };
  }).filter(Boolean);
  samples.push({
    id: row.id,
    skill: row.skill,
    part: String(row.part),
    title: row.title ?? null,
    instruction: row.instruction ?? null,
    content: row.content,
    answers: row.answers ?? {},
    media
  });
}

fs.mkdirSync(path.dirname(path.resolve('src/data/aptisSamples.json')), { recursive: true });
fs.writeFileSync(path.resolve('src/data/aptisSamples.json'), `${JSON.stringify(samples)}\n`);
fs.mkdirSync(outputRoot, { recursive: true });
for (const relative of mediaPaths) {
  const source = path.resolve(sourceRoot, relative);
  const filename = path.posix.basename(relative);
  fs.copyFileSync(source, path.join(outputRoot, filename));
}
console.log(`Packaged ${samples.length} Aptis samples and ${mediaPaths.size} media files.`);
