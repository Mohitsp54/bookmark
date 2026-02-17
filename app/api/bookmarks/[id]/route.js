import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// DELETE - Delete a bookmark by ID
export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 },
      );
    }

    // Verify the bookmark belongs to the user before deleting
    const { data: bookmark, error: findError } = await supabaseAdmin
      .from("bookmarks")
      .select("id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      console.error("Error finding bookmark:", findError);
      return NextResponse.json(
        { error: "Failed to delete bookmark" },
        { status: 500 },
      );
    }

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    if (bookmark.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own bookmarks" },
        { status: 403 },
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (deleteError) {
      console.error("Error deleting bookmark:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete bookmark" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}
