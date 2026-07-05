import { getById, update, remove } from "../_lib/kv.js";

const NAME = "users";

export default async function handler(request) {
  const { method, nextUrl } = request;
  const id = nextUrl.pathname.split("/").pop();

  try {
    if (method === "GET") {
      const item = await getById(NAME, id);
      if (!item) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(item);
    }

    if (method === "PUT") {
      const body = await request.json();
      const updated = await update(NAME, id, body);
      if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(updated);
    }

    if (method === "DELETE") {
      const deleted = await remove(NAME, id);
      if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
