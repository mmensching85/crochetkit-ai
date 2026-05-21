// Seed KV from existing data/*.json files
// Usage: CLOUDFLARE_API_TOKEN=xxx node scripts/seed-kv.js <namespace-id> <file>
// Example: node scripts/seed-kv.js <contacts-ns-id> data/contacts.json

const fs = require('fs');

async function main() {
  const nsId = process.argv[2];
  const filePath = process.argv[3];

  if (!nsId || !filePath) {
    console.error('Usage: node scripts/seed-kv.js <namespace-id> <data-file.json>');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(records) || records.length === 0) {
    console.log(`No records in ${filePath}`);
    return;
  }

  const prefix = filePath.includes('contact') ? 'contact' : 'feedback';

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const key = `${prefix}:seed:${i}:${Date.now()}`;
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${nsId}/values/${encodeURIComponent(key)}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rec)
    });

    const result = await res.json();
    if (!result.success) {
      console.error(`Failed to seed ${key}:`, result.errors);
    } else {
      console.log(`Seeded ${key}`);
    }
  }

  console.log(`Done: ${records.length} records seeded to KV`);
}

main().catch(console.error);
