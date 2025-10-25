import {
	FileTextIcon,
	LayoutDashboardIcon,
	PackageIcon,
	UsersIcon,
} from "lucide-react";
import { Route as ClientsRoute } from "@/routes/_authenticated/clients";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { Route as InvoicesRoute } from "@/routes/_authenticated/invoices";
import { Route as ServicesRoute } from "@/routes/_authenticated/services";

export const appSidebarItems = [
	{
		title: "Dashboard",
		url: DashboardRoute.to,
		icon: LayoutDashboardIcon,
	},
	{
		title: "Clients",
		url: ClientsRoute.to,
		icon: UsersIcon,
	},
	{
		title: "Services",
		url: ServicesRoute.to,
		icon: PackageIcon,
	},
	{
		title: "Invoices",
		url: InvoicesRoute.to,
		icon: FileTextIcon,
	},
];
