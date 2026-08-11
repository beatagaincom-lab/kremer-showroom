"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createComment,
  fetchComments,
  type NewComment,
  type ProductComment,
} from "@/lib/comments";

const AUTHOR_KEY = "kremer-showroom-comment-author:v1";

export type CommentsStatus = "loading" | "ready" | "error";

export function loadStoredAuthor(): string {
  try {
    return window.localStorage.getItem(AUTHOR_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveStoredAuthor(name: string) {
  try {
    window.localStorage.setItem(AUTHOR_KEY, name);
  } catch {
    // Speicherung ist optional; private Modi dürfen still fehlschlagen.
  }
}

export function useProductComments(productSlug: string) {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [status, setStatus] = useState<CommentsStatus>("loading");

  const reload = useCallback(async () => {
    setStatus("loading");
    try {
      setComments(await fetchComments(productSlug));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [productSlug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const countByItem = useMemo(() => {
    const map = new Map<string, number>();
    for (const comment of comments) {
      const key = comment.item_id ?? "";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [comments]);

  const commentsFor = useCallback(
    (itemId: string | null) => comments.filter((comment) => (comment.item_id ?? null) === itemId),
    [comments],
  );

  const submit = useCallback(
    async (input: Omit<NewComment, "productSlug">) => {
      const row = await createComment({ ...input, productSlug });
      setComments((current) => [...current, row]);
      return row;
    },
    [productSlug],
  );

  return { comments, status, reload, countByItem, commentsFor, submit };
}
