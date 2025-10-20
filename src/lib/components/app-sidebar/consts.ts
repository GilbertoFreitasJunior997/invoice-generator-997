import {
	FileCheckIcon,
	FileTextIcon,
	LayoutDashboardIcon,
	UsersIcon,
} from "lucide-react";
import { Route as ClientsRoute } from "@/routes/_authenticated/clients";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { Route as InvoicesRoute } from "@/routes/_authenticated/invoices";
import { Route as ServiceAgreementsRoute } from "@/routes/_authenticated/service-agreements";

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
	{
		title: "Service Agreements",
		url: ServiceAgreementsRoute.to,
		icon: FileCheckIcon,
	},
];
