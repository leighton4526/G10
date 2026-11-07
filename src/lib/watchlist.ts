import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export const listWatchlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ currency_code: string }>`
      select currency_code from watchlist
      where user_id = ${context.userId}
      order by created_at asc
    `;
    return rows.map((r) => r.currency_code);
  });

export const toggleWatch = createServerFn({ method: "POST" })
  .validator((code: string) => code.trim().toLowerCase())
  .middleware([authMiddleware])
  .handler(async ({ context, data: code }) => {
    const sql = await getSql();
    const existing = await sql<{ currency_code: string }>`
      select currency_code from watchlist
      where user_id = ${context.userId} and currency_code = ${code}
    `;
    if (existing.length) {
      await sql`
        delete from watchlist
        where user_id = ${context.userId} and currency_code = ${code}
      `;
      return { watched: false };
    }
    await sql`
      insert into watchlist (user_id, currency_code)
      values (${context.userId}, ${code})
    `;
    return { watched: true };
  });
