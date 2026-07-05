import { getAll, create } from "./_lib/kv.js";

const NAME = "matkul";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const items = await getAll(NAME);
      return res.status(200).json(items);
    }

    if (method === "POST") {
      const item = await create(NAME, req.body);
      return res.status(201).json(item);
    }

    if (method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
