"use client";
import { SignoutButton } from "@/components/Button/SignoutButton";
import Link from "next/link";
import { useState } from "react";
import { Dropdown } from "./Dropdown";

interface IHeaderProps  {
  isUserAuthenticated: boolean
}
export function Header({isUserAuthenticated} : IHeaderProps) {
	function toggleTicketDropDown() {
		setIsDropdownOpen(!isDropdownOpen);
	}
	if(typeof window !== "undefined") {

		document.body.addEventListener("click", () => {
			setIsDropdownOpen(false);
		});
	}
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	return (
		<header className="w-full bg-purple-500 py-6 px-6">
			<div className=" flex justify-between items-center">
				<div>
					<Link className="no-underline text-slate-100 hover:text-slate-200" href={"/"}><h1 className="font-bold  text-2xl">Ticketing</h1></Link>
				</div>
				{/* <div>
					<h1 className="font-bold text-slate-100 text-2xl">Ticketing</h1>
				</div> */}
				<Dropdown options={[
					{
						title: "Create a ticket",
						path: "/tickets/new"
					},
					{
						title: "My orders",
						path: "/orders"
					}
				]} title="Menu" isDropdownOpen={isDropdownOpen} onClick={toggleTicketDropDown} />
				{!isUserAuthenticated ? (<div className="flex gap-4">
					<Link className="font-bold text-slate-200 text-lg hover:text-slate-100" href={"/auth/signin"}>Sign in</Link>
					<Link className="font-bold text-slate-200 text-lg hover:text-slate-100" href={"/auth/signup"}>Sign up</Link>
				</div>) :   <SignoutButton>Signout</SignoutButton> }
			</div>
		</header>
	);
}