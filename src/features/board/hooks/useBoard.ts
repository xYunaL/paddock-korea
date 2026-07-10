"use client";

import { useCallback, useState } from "react";
import { primaryTeamId } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import type { BoardScope, Post } from "../types";
import { SEED_POSTS } from "../mock-data";

export type SortOrder = "latest" | "popular";

type AddPostInput = {
  scope: BoardScope;
  teamId?: string;
  title: string;
  body: string;
  imageUrl?: string;
  profile: UserProfile;
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/**
 * In-memory board store (global + team posts) with likes and comments.
 * Mirrors the useMemes pattern; called once at page level so posts survive
 * tab switches. Resets on reload.
 */
export function useBoard() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const addPost = useCallback(
    ({ scope, teamId, title, body, imageUrl, profile }: AddPostInput) => {
      const post: Post = {
        id: newId("post"),
        scope,
        teamId: scope === "team" ? teamId : undefined,
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl?.trim() || undefined,
        authorNickname: profile.nickname,
        authorTeamId: primaryTeamId(profile) ?? "",
        authorAvatarUrl: profile.avatarUrl,
        authorDriverTag: profile.driverTag,
        likes: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      setPosts((prev) => [post, ...prev]);
    },
    []
  );

  const incrementView = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p))
    );
  }, []);

  const toggleLike = useCallback(
    (id: string) => {
      const liked = likedIds.has(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p
        )
      );
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (liked) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [likedIds]
  );

  const addComment = useCallback(
    (postId: string, text: string, profile: UserProfile, imageUrl?: string) => {
      const trimmed = text.trim();
      const image = imageUrl?.trim() || undefined;
      // Allow text-only, image-only, or both — but not empty.
      if (!trimmed && !image) return;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: newId("cmt"),
                    authorNickname: profile.nickname,
                    authorTeamId: primaryTeamId(profile) ?? "",
                    authorAvatarUrl: profile.avatarUrl,
                    authorDriverTag: profile.driverTag,
                    text: trimmed,
                    imageUrl: image,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : p
        )
      );
    },
    []
  );

  return { posts, likedIds, addPost, toggleLike, addComment, incrementView };
}

export type BoardApi = ReturnType<typeof useBoard>;
