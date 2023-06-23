"use client";
import { api } from "@/services/api";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type  CurrentUser = {
  id: string;
  email: string;
  iat: string;
}
interface ILandingPageProps {
  currentUser: CurrentUser
}
export function LandingPage({currentUser} : ILandingPageProps) {
	// thisIsUnsafe(); 
	const router = useRouter();

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">

			{currentUser ? <h1>You're signed in {currentUser.email}!</h1> : <h1>you're not signed in, <Link href={"/auth/signin"} className="text-blue-700 font-bold"> Click here to sign in</Link></h1>}
			
		</main>
	);

}