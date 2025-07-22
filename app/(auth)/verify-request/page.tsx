"use server"

import { redirect } from "next/navigation";
import VerifyRequestForm from "./_components/VerifyRequestForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function VerifyRequest({searchParams}: {searchParams: {email?: string}}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const email = searchParams.email;
    
    if (session) {
        return redirect("/");
    }

    if (!email) {
        redirect("/login");
        return null;
    }
    
    return(
        <VerifyRequestForm email={email}/>
    )
}