"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Participant = {
    id: string;
    email: string;
    response_token: string;
};

type Meeting = {
    id: string;
    title: string;
    purpose: string;
    participants: Participant[];
};

export default function MeetingPage() {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const loadMeeting = async () => {
            const id = window.location.pathname.split("/").pop();

            if (!id) {
                setLoading(false);
                return;
            }

            // Supabaseから会議を取得
            const { data, error } = await supabase
                .from("meetings")
                .select(`
                    id,
                    title,
                    purpose,
                    participants (
                        id,
                        email,
                        response_token
                    )
                `)
                .eq("id", id)
                .single();

            if (error) {
                console.error("会議取得エラー:", error);
                setLoading(false);
                return;
            }

            setMeeting(data);
            setLoading(false);
        };

        loadMeeting();
    }, []);

    // 読み込み中
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    会議を読み込んでいます...
                </p>
            </main>
        );
    }

    // 会議が見つからない
    if (!meeting) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        会議が見つかりません
                    </h1>

                    <p className="mt-3 text-gray-500">
                        会議が存在しないか、アクセスする権限がありません。
                    </p>

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

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">

            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-5xl px-6 py-5">
                    <Link href="/" className="text-2xl font-bold">
                        NoMeet
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-3xl px-6 py-12">

                <div className="rounded-2xl bg-white p-8 shadow-sm">

                    <p className="text-sm font-semibold tracking-widest text-blue-600">
                        MEETING
                    </p>

                    <h1 className="mt-3 text-3xl font-bold">
                        {meeting.title}
                    </h1>

                    {/* 会議の目的 */}
                    <div className="mt-8">

                        <h2 className="text-sm font-semibold text-gray-500">
                            会議の目的
                        </h2>

                        <p className="mt-2 rounded-xl bg-gray-50 p-5 leading-7">
                            {meeting.purpose}
                        </p>

                    </div>

                    {/* 参加者 */}
                    <div className="mt-8">

                        <h2 className="text-sm font-semibold text-gray-500">
                            参加者
                        </h2>

                        <div className="mt-3 space-y-2">

                            {meeting.participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="rounded-xl border border-gray-200 px-4 py-4"
                                >
                                    <p className="font-medium">
                                        {participant.email}
                                    </p>

                                    <div className="mt-2">
                                        <p className="break-all text-sm text-gray-500">
                                            {window.location.origin}/respond/{participant.response_token}
                                        </p>

                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/respond/${participant.response_token}`;
                                                navigator.clipboard.writeText(url);
                                                alert("回答用URLをコピーしました！");
                                            }}
                                            className="mt-3 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                        >
                                            URLをコピー
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* 回答 */}
                    <div className="mt-10 rounded-2xl bg-blue-50 p-6">

                        <h2 className="font-bold">
                            次のステップ
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            参加者に意見を回答してもらい、
                            会議が本当に必要なのかを判断します。
                        </p>

                        <Link
                            href={`/meeting/${meeting.id}/results`}
                            className="mt-6 block w-full rounded-xl bg-black px-6 py-4 text-center font-semibold text-white transition hover:bg-gray-800"
                        >
                            回答結果を見る
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}