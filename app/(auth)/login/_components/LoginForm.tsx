"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { GithubIcon, Loader, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const router = useRouter();
    const [email, setEmail] = useState("");

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in with Github successfully");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Internal Server Error")
                    }
                }
            })
        })
    }

    function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: 'sign-in',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification email sent, please check your inbox");
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: () => {
                        toast.error("Failed to send verification email, please try again");
                    }
                }
            })
        })
    }

    function isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">
                    Welcome back!
                </CardTitle>
                <CardDescription>
                    Login with your Github or Email Account
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button disabled={githubPending} onClick={signInWithGithub} className="w-full" variant={"outline"}>
                    {githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin"/>
                            <span>Loading...</span>
                        </>
                        ) : (
                        <>
                            <GithubIcon className="size-4"/>
                            Sign in with Github
                        </>
                    )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input value={email} required onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="m@example.com"/>
                    </div>

                    <Button onClick={signInWithEmail} disabled={emailPending || !isValidEmail(email)} >
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin"/>
                                <span>Loading...</span>
                            </>
                            ) : (
                            <>
                                <Send className="size-4"/>
                                Continue with Email
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}