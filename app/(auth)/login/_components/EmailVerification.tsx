import * as React from 'react';

interface emailVerification {
  email: string;
  otp: string;
}

export function emailVerification({ email, otp }: emailVerification) {
  return (
    <div>
      <h5>Hi {email}, please verify your email using the code below.</h5>
      <h1>{otp}</h1>
    </div>
  );
}