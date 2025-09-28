"use client";

import {Button} from "@/components/ui/button";

export default function LoginPage() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

    return (
        <div className="flex flex-col min-h-screen items-center justify-center content-center gap-4">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <a href={`${backendUrl}/oauth2/authorization/google`}>
                <Button className={"rounded-xs cursor-pointer"}>Login with Google</Button>
            </a>
        </div>
    );
}
