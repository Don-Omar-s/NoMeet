import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">
          NoMeet
        </div>

        <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          ログイン
        </button>
      </header>

      {/* メイン */}
      <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <div className="max-w-3xl text-center">

          <p className="mb-6 text-sm font-semibold tracking-widest text-blue-600">
            MEETING DECISION PLATFORM
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            その会議、
            <br />
            本当に必要ですか？
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-500">
            NoMeetは、会議を始める前に参加者の意見を集め、
            本当に全員で話し合う必要があるのかを判断するサービスです。
          </p>

          {/* ボタン */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/create"
              className="w-64 rounded-xl bg-black px-5 py-3 text-center font-semibold text-white"
            >
              会議を作成する
            </Link>

            <Link
              href="/dashboard"
              className="w-64 rounded-xl border border-gray-200 bg-white px-5 py-3 text-center font-semibold hover:bg-gray-50"
            >
              会議一覧
            </Link>

            <Link
              href="/join"
              className="w-64 rounded-xl border border-gray-200 bg-white px-5 py-3 text-center font-semibold hover:bg-gray-50"
            >
              会議に参加する
            </Link>
          </div>

          {/* 下部説明 */}
          <div className="mt-20 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">

            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="mb-3 text-2xl">①</div>
              <h2 className="font-semibold">
                議題を作る
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                会議の目的と参加者を設定します。
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="mb-3 text-2xl">②</div>
              <h2 className="font-semibold">
                意見を集める
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                参加者が会議前に意見を回答します。
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="mb-3 text-2xl">③</div>
              <h2 className="font-semibold">
                必要性を判断
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                意見の一致度から会議の必要性を判断します。
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}