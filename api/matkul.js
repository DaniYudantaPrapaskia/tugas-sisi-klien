import { getAll, create } from "./_lib/kv.js";

const NAME = "matkul";

export default async function handler(request) {
  const { method } = request;

  try {
    if (method === "GET") {
      const items = await getAll(NAME);
      return Response.json(items);
    }

    if (method === "POST") {
      const body = await request.json();
      const item = await create(NAME, body);
      return Response.json(item, { status: 201 });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
