import { getById, update, remove } from "../_lib/kv.js";

const NAME = "users";

export default async function handler(req, res) {
  const { method, query } = req;
  const id = query.id;

  try {
    if (method === "GET") {
      const item = await getById(NAME, id);
      if (!item) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(item);
    }

    if (method === "PUT") {
      const updated = await update(NAME, id, req.body);
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(updated);
    }

    if (method === "DELETE") {
      const deleted = await remove(NAME, id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ success: true });
    }

    if (method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
