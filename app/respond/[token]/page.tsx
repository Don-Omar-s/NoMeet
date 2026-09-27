"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MeetingData = {
    meeting_id: string;
    title: string;
    purpose: string;
    response_deadline: string | null;
};

export default function RespondPage() {
    const supabase = createClient();

    const [meeting, setMeeting] = useState<MeetingData | null>(null);
    const [answer, setAnswer] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const loadMeeting = async () => {
            const token = window.location.pathname.split("/").pop();

            if (!token) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase.rpc(
                "get_response_page",
                {
                    p_token: token,
                }
            );

            if (error) {
                console.error("回答ページ取得エラー:", error);
                setLoading(false);
                return;
            }

            if (!data || data.length === 0) {
                console.error("回答ページが見つかりません");
                setLoading(false);
                return;
            }

            const participant = data[0];

            setMeeting({
                meeting_id: participant.meeting_id,
                title: participant.meeting_title,
                purpose: participant.meeting_purpose,
                response_deadline: participant.response_deadline,
            });

            setLoading(false);
        };

        loadMeeting();
    }, []);

    const handleSubmit = async () => {
        if (!answer) {
            alert("回答を選択してください");
            return;
        }

        const token = window.location.pathname.split("/").pop();

        if (!token || !meeting) {
            return;
        }

        // 回答期限を過ぎているか確認
        if (
            meeting.response_deadline &&
            new Date() >= new Date(meeting.response_deadline)
        ) {
            alert("回答期限が過ぎています");
            return;
        }

        const answerValue =
            answer === "賛成"
                ? "agree"
                : answer === "反対"
                    ? "disagree"
                    : "undecided";

        const { error } = await supabase.rpc("submit_response", {
            p_token: token,
            p_answer: answerValue,
            p_comment: comment.trim() || null,
        });

        if (error) {
            console.error("回答保存エラー:", error);
            alert("回答の保存に失敗しました");
            return;
        }

        setSubmitted(true);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    読み込んでいます...
                </p>
            </main>
        );
    }

    if (!meeting) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        回答ページが見つかりません
                    </h1>

                    <p className="mt-3 text-gray-500">
                        URLが正しくないか、無効な回答URLです。
                    </p>
                </div>
            </main>
        );
    }

    // 回答期限が過ぎているか確認
    const deadlinePassed =
        meeting.response_deadline !== null &&
        new Date() >= new Date(meeting.response_deadline);

    if (deadlinePassed) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">
                    <div className="text-5xl">
                        ⏰
                    </div>

                    <h1 className="mt-6 text-3xl font-bold">
                        回答期限が過ぎています
                    </h1>

                    <p className="mt-4 leading-7 text-gray-500">
                        この会議の回答受付は終了しました。
                    </p>

                    <div className="mt-6 rounded-xl bg-gray-50 p-5 text-left">
                        <p className="text-sm font-semibold text-gray-500">
                            会議
                        </p>

                        <p className="mt-2 font-semibold">
                            {meeting.title}
                        </p>
                    </div>
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
                        回答を保存しました。
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-3xl px-6 py-5">
                    <div className="text-2xl font-bold">
                        NoMeet
                    </div>
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

                    {meeting.response_deadline && (
                        <div className="mt-4 rounded-xl bg-blue-50 p-5">
                            <p className="text-sm font-semibold text-blue-600">
                                回答期限
                            </p>

                            <p className="mt-2 font-semibold">
                                {new Date(
                                    meeting.response_deadline
                                ).toLocaleString("ja-JP")}
                            </p>
                        </div>
                    )}

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