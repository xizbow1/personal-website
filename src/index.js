
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/visit") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405
        });
      }

      try {
        const result = await env.DB.prepare(`
          UPDATE visitor_counter
          SET visits = visits + 1
          WHERE id = 1
          RETURNING visits
        `).first();

        if (!result) {
          throw new Error("Counter not initialized");
        }

        return Response.json(
          { visits: result.visits },
          { headers: { "Cache-Control": "no-store" } }
        );
      } catch (error) {
        console.error(error);
        return Response.json(
          { error: "Counter unavailable" },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
