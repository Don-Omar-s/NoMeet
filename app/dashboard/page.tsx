"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Meeting = {
    id: string;
    title: string;
    purpose: string;
    created_at: string;
};

export default function DashboardPage() {
    const supabase = createClient();

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMeetings = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                window.location.href = "/login";
                return;
            }

            const { data, error } = await supabase
                .from("meetings")
                .select("id, title, purpose, created_at")
                .eq("owner_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("会議取得エラー:", error);
                setLoading(false);
                return;
            }

            setMeetings(data || []);
            setLoading(false);
        };

        loadMeetings();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    会議を読み込んでいます...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                    <Link href="/" className="text-2xl font-bold">
                        NoMeet
                    </Link>

                    <Link
                        href="/create"
                        className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
                    >
                        会議を作成
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-6 py-12">
                <h1 className="text-3xl font-bold">
                    会議一覧
                </h1>

                <p className="mt-2 text-gray-500">
                    作成した会議を管理できます。
                </p>

                {meetings.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            まだ会議がありません。
                        </p>

                        <Link
                            href="/create"
                            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white"
                        >
                            最初の会議を作成する
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 space-y-4">
                        {meetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-xl font-bold">
                                    {meeting.title}
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    {meeting.purpose}
                                </p>

                                <Link
                                    href={`/meeting/${meeting.id}`}
                                    className="mt-5 inline-block rounded-xl border border-gray-200 px-5 py-3 font-semibold hover:bg-gray-50"
                                >
                                    会議を開く
                                </Link>

                                <Link
                                    href={`/meeting/${meeting.id}/results`}
                                    className="ml-3 inline-block rounded-xl bg-black px-5 py-3 font-semibold text-white"
                                >
                                    結果を見る
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}