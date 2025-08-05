"use client"
import Lottie from "lottie-react";
import waitingAI from "../public/waitingAI.json";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center rounded-lg bg-white p-8 shadow-2xl">
        <Lottie animationData={waitingAI} className="h-48 w-48" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Document processing...</p>
      </div>
    </div>
  );
}