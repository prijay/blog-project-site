"use client";
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";

export default function EditorPage() {
    const [editor, setEditor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [excerpt, setExcerpt] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get("id");
    const supabase = createClient();
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        const initiEditor = async () => {
            const EditorJS = (await import("@editorjs/editorjs")).default;
            const Header = (await import("@editorjs/header")).default;
            const Paragraph = (await import("@editorjs/paragraph")).default;
            const List = (await import("@editorjs/list")).default;
            const Image = (await import("@editorjs/image")).default;
            const Quote = (await import("@editorjs/quote")).default;
            const Code = (await import("@editorjs/code")).default;
            const editorInstance = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: Header,
                    paragraph: Paragraph,
                    list: List,
                    quote: Quote,
                    code: Code,
                    image: {
                        class: Image,
                        config: {
                            uploader: {
                                uploadByFile: async (file) => {
                                    const { data: { user } } = await supabase.auth.getUser();
                                    if (!user) {
                                        throw new Error("User not authenticated");
                                    }
                                    const fileName = `${Date.now()}-${file.name}`;
                                    const { uploadError } = await supabase.storage
                                        .from("blog-images")
                                        .upload(`${user.id}/${fileName}`, file);
                                    if (uploadError) {
                                        throw uploadError;
                                    }
                                    const { data } = await supabase.storage.from("blog-images")
                                        .getPublicUrl(`${user.id}/${fileName}`);
                                    return {
                                        success: 1,
                                        file: {
                                            url: data.publicUrl,
                                        }
                                    }
                                }
                            }

                        },
                    },
                    onReady: () => {
                        console.log("Editor.js is ready to work!");
                    }
                },

            });

            if (postId) {
                const { data: post } = await supabase.from("posts").select("*").eq("id", postId).single();
                if (post) {
                    setTitle(post.title);
                    await editorInstance.render(post.content);

                }
            }
            setEditor(editorInstance);
        }
        initiEditor();

    }, [postId, supabase]);



    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("User not authenticated");
                setSaving(false);
                return;
            }
            const content = await editor.save();
            console.log("Post content:", content);
            if (postId) {
                const { error: updateError } = await supabase.from("posts").update({
                    title,
                    excerpt,
                    content: JSON.stringify(content),
                    updated_at: new Date().toISOString()
                }).eq("id", postId)
                    .eq("user_id", user.id);

                if (updateError) {
                    throw updateError;
                }
                else {
                    router.push("/");
                }
            }
            else {
                const { error: insertError } = await supabase.from("posts").insert({
                    title,
                    excerpt,
                    content: JSON.stringify(content),
                    user_id: user.id
                });
                if (insertError) {
                    throw insertError;
                }
                else {
                    router.push("/");
                }
            }
        }
        catch (err) {
            setError("Failed to save post. Please try again.");
        }

    }
    return (
        <main className="min-h-screen bg-violet-300 dark:bg-violet-200 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-2S00">
                    {postId ? "Edit Post" : "Create New Post"}
                </h1>

                <div className="flex gap-2">
                    {
                        mounted && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="border-violet-400 text-violet-700 dark:border-violet-600 dark:text-violet-200">
                                {theme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
                            </Button>
                        )
                    }
                    <Link href="/" className="border-violet-400 text-violet-700 dark:border-violet-600 dark:text-violet-200 px-4 py-2 rounded-md hover:bg-violet-400 hover:text-white transition-colors">
                        Back to Home
                    </Link>

                </div>

                <div>
                    <div className="mt-10">
                        <input
                            type="text"
                            value={title}
                            placeholder="Post Title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <input
                            type="text"
                            value={excerpt}
                            placeholder="Post Excerpt"
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 mt-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        <div id="editorjs" className="mt-4 border border-gray-300 rounded p-4 min-h-[300px]">
                        </div>

                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                    >
                        {saving ? <SpinnerIcon className="animate-spin" /> : "Save Post"}
                    </Button>

                </div>

                <Link href="/">
                    <Button variant="outline" className="mt-4">
                        Cancel
                    </Button>
                </Link>


            </div>
        </main>
    )

}






