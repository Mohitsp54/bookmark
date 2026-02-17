import { auth } from "@/lib/auth";
import Header from "@/components/Header";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import LoginPage from "@/components/LoginPage";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell pb-12">
      <Header user={session.user} />

      <main className="container pt-8 lg:pt-10">
        <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="soft-text mb-2 text-sm uppercase tracking-[0.18em]">
              personal workspace
            </p>
            <h1 className="page-title">Bookmark Dashboard</h1>
            <p className="soft-text mt-2 text-sm sm:text-base">
              Save links you care about and open them instantly from any device.
            </p>
          </div>
          <span className="pill">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Auto sync enabled
          </span>
        </section>

        <AddBookmarkForm />

        <div className="mb-5 mt-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Your Collection
          </h2>
        </div>

        <BookmarkList />
      </main>
    </div>
  );
}
