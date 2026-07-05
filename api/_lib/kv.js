import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function collectionKey(name) {
  return `tugas-sisi-klien:${name}`;
}

export async function getAll(name) {
  const data = await redis.get(collectionKey(name));
  return data || [];
}

export async function getById(name, id) {
  const items = await getAll(name);
  return items.find((item) => String(item.id) === String(id)) || null;
}

export async function create(name, item) {
  const items = await getAll(name);
  const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  const newItem = { ...item, id: String(maxId + 1) };
  items.push(newItem);
  await redis.set(collectionKey(name), JSON.stringify(items));
  return newItem;
}

export async function update(name, id, data) {
  const items = await getAll(name);
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...data, id: String(id) };
  await redis.set(collectionKey(name), JSON.stringify(items));
  return items[index];
}

export async function remove(name, id) {
  const items = await getAll(name);
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return false;
  items.splice(index, 1);
  await redis.set(collectionKey(name), JSON.stringify(items));
  return true;
}
