"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ResponseData = {
    id: string;
    answer: string;
    comment: string | null;
};

type Meeting = {
    id: string;
    title: string;
    purpose: string;
};

export default function ResultsPage() {
    const supabase = createClient();

    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [responses, setResponses] = useState<ResponseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [participantCount, setParticipantCount] = useState(0);

    useEffect(() => {
        const loadResults = async () => {
            const id = window.location.pathname.split("/")[2];

            if (!id) {
                setLoading(false);
                return;
            }

            // 会議を取得
            const { data: meetingData, error: meetingError } =
                await supabase
                    .from("meetings")
                    .select("id, title, purpose")
                    .eq("id", id)
                    .single();

            if (meetingError || !meetingData) {
                console.error("会議取得エラー:", meetingError);
                setLoading(false);
                return;
            }

            // 回答を取得
            const { data: responseData, error: responseError } =
                await supabase
                    .from("responses")
                    .select("id, answer, comment")
                    .eq("meeting_id", id)
                    .order("created_at", { ascending: true });

            const { count: participantCountData, error: participantCountError } =
                await supabase
                    .from("participants")
                    .select("id", { count: "exact", head: true })
                    .eq("meeting_id", id);

            if (participantCountError) {
                console.error("参加者数取得エラー:", participantCountError);
                setLoading(false);
                return;
            }

            if (responseError) {
                console.error("回答取得エラー:", responseError);
                setLoading(false);
                return;
            }

            setMeeting(meetingData);
            setResponses(responseData || []);
            setParticipantCount(participantCountData ?? 0);
            setLoading(false);
        };

        loadResults();
    }, []);

    const agreeCount = responses.filter(
        (response) => response.answer === "agree"
    ).length;

    const disagreeCount = responses.filter(
        (response) => response.answer === "disagree"
    ).length;

    const undecidedCount = responses.filter(
        (response) => response.answer === "undecided"
    ).length;

    const responseRate =
        participantCount === 0
            ? 0
            : Math.round((responses.length / participantCount) * 100);

    const disagreeComments = responses.filter(
        (response) =>
            response.answer === "disagree" && response.comment
    );

    const undecidedComments = responses.filter(
        (response) =>
            response.answer === "undecided" && response.comment
    );

    let decisionTitle = "";
    let decisionMessage = "";

    if (participantCount === 0) {
        decisionTitle = "参加者がいません";
        decisionMessage = "会議の参加者を追加してください。";
    } else if (responses.length < participantCount) {
        decisionTitle = "回答待ち";
        decisionMessage =
            `${participantCount - responses.length}人がまだ回答していません。全員の回答が揃ってからNoMeet判定を行います。`;
    } else if (disagreeCount > agreeCount) {
        decisionTitle = "会議を開くことをおすすめします";
        decisionMessage =
            "反対意見が多いため、会議で話し合う必要がありそうです。";
    } else if (undecidedCount > agreeCount) {
        decisionTitle = "まず情報整理が必要です";
        decisionMessage =
            "判断できない人が多いため、会議の前に追加情報を共有するとよさそうです。";
    } else {
        decisionTitle = "会議なしで進められる可能性があります";
        decisionMessage =
            "賛成意見が多いため、会議を開かずに進められる可能性があります。";
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    結果を読み込んでいます...
                </p>
            </main>
        );
    }

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
                        RESULTS
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

                    <div className="mt-10 rounded-2xl bg-blue-50 p-6">
                        <p className="text-sm font-semibold text-blue-600">
                            NoMeet判定
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            {decisionTitle}
                        </h2>

                        <p className="mt-3 leading-7 text-gray-700">
                            {decisionMessage}
                        </p>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold">
                            回答結果
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {responses.length}人 / {participantCount}人が回答
                        </p>

                        <p className="mt-1 text-gray-500">
                            回答率 {responseRate}%
                        </p>

                        <div className="mt-5 space-y-4">

                            <div className="rounded-xl border p-5">
                                <div className="flex justify-between">
                                    <span className="font-bold">
                                        賛成
                                    </span>
                                    <span className="font-bold">
                                        {agreeCount}人
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border p-5">
                                <div className="flex justify-between">
                                    <span className="font-bold">
                                        反対
                                    </span>
                                    <span className="font-bold">
                                        {disagreeCount}人
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border p-5">
                                <div className="flex justify-between">
                                    <span className="font-bold">
                                        判断できない
                                    </span>
                                    <span className="font-bold">
                                        {undecidedCount}人
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold">
                            反対・保留の意見
                        </h2>

                        <div className="mt-5 space-y-4">

                            {disagreeComments.length === 0 &&
                                undecidedComments.length === 0 ? (
                                <p className="text-gray-500">
                                    反対・保留のコメントはありません。
                                </p>
                            ) : (
                                <>
                                    {disagreeComments.map((response) => (
                                        <div
                                            key={response.id}
                                            className="rounded-xl border border-gray-200 bg-white p-5"
                                        >
                                            <p className="text-sm font-semibold text-gray-500">
                                                反対
                                            </p>

                                            <p className="mt-2 leading-7">
                                                {response.comment}
                                            </p>
                                        </div>
                                    ))}

                                    {undecidedComments.map((response) => (
                                        <div
                                            key={response.id}
                                            className="rounded-xl border border-gray-200 bg-white p-5"
                                        >
                                            <p className="text-sm font-semibold text-gray-500">
                                                判断できない
                                            </p>

                                            <p className="mt-2 leading-7">
                                                {response.comment}
                                            </p>
                                        </div>
                                    ))}
                                </>
                            )}

                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold">
                            参加者のコメント
                        </h2>

                        <div className="mt-5 space-y-3">

                            {responses.filter(
                                (response) => response.comment
                            ).length === 0 ? (
                                <p className="text-gray-500">
                                    まだコメントはありません。
                                </p>
                            ) : (
                                responses
                                    .filter((response) => response.comment)
                                    .map((response) => (
                                        <div
                                            key={response.id}
                                            className="rounded-xl bg-gray-50 p-5"
                                        >
                                            {response.comment}
                                        </div>
                                    ))
                            )}

                        </div>
                    </div>

                    <Link
                        href={`/meeting/${meeting.id}`}
                        className="mt-10 block w-full rounded-xl border border-gray-200 px-6 py-4 text-center font-semibold hover:bg-gray-50"
                    >
                        会議ページに戻る
                    </Link>

                </div>

            </section>

        </main>
    );
}