"use client";
import { SignoutButton } from "@/components/Button/SignoutButton";
import Link from "next/link";
import { useRouter } from "next/router";

interface IHeaderProps  {
  isUserAuthenticated: boolean
}
export function Header({isUserAuthenticated} : IHeaderProps) {
	

	return (
		<header className="w-full bg-purple-500 py-6 px-6">
			<div className=" flex justify-between items-center">
				<div>
					<h1 className="font-bold text-slate-100 text-2xl">Ticketing</h1>
				</div>
				{/* <div>
					<h1 className="font-bold text-slate-100 text-2xl">Ticketing</h1>
				</div> */}
				{!isUserAuthenticated ? (<div className="flex gap-4">
					<Link className="font-bold text-slate-200 text-lg hover:text-slate-100" href={"/auth/signin"}>Sign in</Link>
					<Link className="font-bold text-slate-200 text-lg hover:text-slate-100" href={"/auth/signup"}>Sign up</Link>
				</div>) :   <SignoutButton>Signout</SignoutButton> }
			</div>
		</header>
	);
}