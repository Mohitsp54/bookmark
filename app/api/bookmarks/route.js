import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Fetch all bookmarks for the authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .select("id, url, title, user_id, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookmarks" },
        { status: 500 },
      );
    }

    const bookmarks = (data || []).map((bookmark) => ({
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      userId: bookmark.user_id,
      createdAt: bookmark.created_at,
    }));

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

// POST - Create a new bookmark
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, title } = await request.json();

    if (!url || !title) {
      return NextResponse.json(
        { error: "URL and title are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .insert({
        url,
        title,
        user_id: session.user.id,
      })
      .select("id, url, title, user_id, created_at")
      .single();

    if (error) {
      console.error("Error creating bookmark:", error);
      return NextResponse.json(
        { error: "Failed to create bookmark" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        id: data.id,
        url: data.url,
        title: data.title,
        userId: data.user_id,
        createdAt: data.created_at,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
