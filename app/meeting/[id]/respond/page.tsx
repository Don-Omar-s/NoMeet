"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  purpose: string;
  participants: string[];
};

export default function RespondPage() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];

    if (!id) return;

    const savedMeeting = localStorage.getItem(`meeting-${id}`);

    if (savedMeeting) {
      setMeeting(JSON.parse(savedMeeting));
    }
  }, []);

  const handleSubmit = () => {
    if (!answer) {
      alert("回答を選択してください");
      return;
    }

    if (!meeting) return;

    const response = {
      meetingId: meeting.id,
      answer,
      comment,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `response-${meeting.id}`,
      JSON.stringify(response)
    );

    setSubmitted(true);
  };

  if (!meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            会議が見つかりません
          </h1>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            回答ありがとうございました
          </h1>

          <p className="mt-4 leading-7 text-gray-500">
            参加者全員の回答が集まったら、
            会議の必要性を判断します。
          </p>

          <Link
            href={`/meeting/${meeting.id}`}
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            会議ページへ戻る
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            NoMeet
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-12">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <p className="text-sm font-semibold tracking-widest text-blue-600">
            YOUR OPINION
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {meeting.title}
          </h1>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-500">
              会議の目的
            </p>

            <p className="mt-2 leading-7">
              {meeting.purpose}
            </p>
          </div>

          <div className="mt-8">

            <h2 className="text-lg font-bold">
              あなたの意見を教えてください
            </h2>

            <div className="mt-4 space-y-3">

              <button
                type="button"
                onClick={() => setAnswer("賛成")}
                className={`w-full rounded-xl border p-5 text-left transition ${
                  answer === "賛成"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-bold">
                  賛成
                </div>

                <div className="mt-1 text-sm opacity-70">
                  この内容で進めて問題ありません
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAnswer("反対")}
                className={`w-full rounded-xl border p-5 text-left transition ${
                  answer === "反対"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-bold">
                  反対
                </div>

                <div className="mt-1 text-sm opacity-70">
                  変更や話し合いが必要です
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAnswer("判断できない")}
                className={`w-full rounded-xl border p-5 text-left transition ${
                  answer === "判断できない"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-bold">
                  判断できない
                </div>

                <div className="mt-1 text-sm opacity-70">
                  もう少し情報が必要です
                </div>
              </button>

            </div>

          </div>

          <div className="mt-8">

            <label className="text-lg font-bold">
              気になること
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="意見や気になる点があれば入力してください"
              rows={5}
              className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />

          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            回答する
          </button>

        </div>

      </section>

    </main>
  );
}