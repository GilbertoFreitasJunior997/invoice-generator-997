import { FileTextIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import { Route as ClientsRoute } from "@/routes/_authenticated/clients";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { Route as InvoicesRoute } from "@/routes/_authenticated/invoices";

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
		title: "Invoices",
		url: InvoicesRoute.to,
		icon: FileTextIcon,
	},
];
