import { Suspense } from "react";
import VerifyRequestForm from "./_components/VerifyRequestForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
      <VerifyRequestForm />
    </Suspense>
  );
}
