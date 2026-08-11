export type ProductComment = {
  id: string;
  product_slug: string;
  item_id: string | null;
  item_label: string | null;
  author: string;
  body: string;
  created_at: string;
};

export type NewComment = {
  productSlug: string;
  itemId?: string | null;
  itemLabel?: string | null;
  author: string;
  body: string;
};

// Der Publishable Key ist bewusst öffentlich (Browser-Key); Schreib- und
// Leserechte werden serverseitig über Row Level Security begrenzt.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://davjpfxjdykdgbrykoey.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_C75hSO_h5vLv8ZTW-jTKNg_u1N7C4Bf";

const ENDPOINT = `${SUPABASE_URL}/rest/v1/product_comments`;

const baseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export async function fetchComments(productSlug: string): Promise<ProductComment[]> {
  const params = new URLSearchParams({
    select: "*",
    product_slug: `eq.${productSlug}`,
    order: "created_at.asc",
  });
  const response = await fetch(`${ENDPOINT}?${params}`, {
    headers: baseHeaders,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Kommentare konnten nicht geladen werden (${response.status}).`);
  return response.json();
}

export async function createComment(input: NewComment): Promise<ProductComment> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { ...baseHeaders, Prefer: "return=representation" },
    body: JSON.stringify({
      product_slug: input.productSlug,
      item_id: input.itemId ?? null,
      item_label: input.itemLabel ?? null,
      author: input.author.trim(),
      body: input.body.trim(),
    }),
  });
  if (!response.ok) throw new Error(`Kommentar konnte nicht gespeichert werden (${response.status}).`);
  const [row] = (await response.json()) as ProductComment[];
  return row;
}
