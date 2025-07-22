"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

function VerifyRequestForm({email}: {email: string}) {
    const [otp, setOtp] = useState("");
    const [emailPending, startTransition] = useTransition();
    const router = useRouter();
    const isOtpCompleted = otp.length === 6;

    function verifyOtp(){
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified successfully");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Failed to verify email, please try again");
                    }
                }
            })
        })
    }

  return (
            <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email</CardTitle>
                <CardDescription>
                    We have sent a verification email code to your email address.
                    Please open the email and paste the code below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        maxLength={6}
                        className="gap-2"
                    >
                        <InputOTPGroup>
                        <InputOTPSlot index={0}/>                            
                        <InputOTPSlot index={1}/>                            
                        <InputOTPSlot index={2}/>                            
                        </InputOTPGroup>
                        <InputOTPGroup>
                        <InputOTPSlot index={3}/>                            
                        <InputOTPSlot index={4}/>                            
                        <InputOTPSlot index={5}/>                            
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your Email</p>
                </div>
                <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="w-full">
                    {emailPending ? (
                        <>
                            <Loader className="size-4 animate-spin"/>
                            <span>Verifying...</span>
                        </>
                        ) : (
                        <span>Verify Request</span>
                        )
                    }
                </Button>
            </CardContent>
        </Card>
  )
}

export default VerifyRequestForm