import { Link } from "@tanstack/react-router";
import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";
import { DropdownMenu } from "@/lib/components/dropdown-menu";
import { Sidebar } from "@/lib/components/sidebar";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import type { UserSelect } from "@/lib/schemas/user.schemas";
import { useSidebar } from "@/lib/stores/sidebar.store";
import { cn } from "@/lib/utils/cn";
import { Route } from "@/routes/_authenticated/route";
import { Avatar } from "../avatar";
import { Logo } from "../logo";
import { appSidebarItems } from "./consts";

const UserInfo = ({ user }: { user: UserSelect }) => {
	return (
		<div className="flex gap-1 py-1.5 px-0.5">
			<Avatar.Root className="h-8 w-8 rounded-lg">
				<Avatar.Image src={user.avatarUrl} alt={user.name} />
				<Avatar.Fallback className="rounded-lg">{user.name[0]}</Avatar.Fallback>
			</Avatar.Root>

			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium">{user.name}</span>
				<span className="text-muted-foreground truncate text-xs">
					{user.email}
				</span>
			</div>
		</div>
	);
};

const NavUser = ({ user }: { user: UserSelect }) => {
	const isMobile = useIsMobile();

	return (
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<Sidebar.MenuButton size="lg">
							<UserInfo user={user} />
							<MoreVerticalIcon className="ml-auto size-4" />
						</Sidebar.MenuButton>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenu.Label className="p-0 font-normal">
							<UserInfo user={user} />
						</DropdownMenu.Label>

						<DropdownMenu.Separator />

						<DropdownMenu.Group>
							<DropdownMenu.Item asChild>
								<Link to="/account">
									<UserCircleIcon />
									Account
								</Link>
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Separator />

						<DropdownMenu.Item asChild>
							<Link to="/logout">
								<LogOutIcon />
								Log out
							</Link>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	);
};

const NavMain = () => {
	return (
		<Sidebar.Group>
			<Sidebar.GroupContent className="flex flex-col gap-2">
				<Sidebar.Menu>
					{appSidebarItems.map((item) => (
						<Sidebar.MenuItem key={item.title}>
							<Link to={item.url}>
								<Sidebar.MenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Sidebar.MenuButton>
							</Link>
						</Sidebar.MenuItem>
					))}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	);
};

export const AppSidebar = () => {
	const { user } = Route.useLoaderData();

	const isOpen = useSidebar((s) => s.isOpen);
	const isOpenMobile = useSidebar((s) => s.isOpenMobile);

	const isSidebarOpen = isOpen || isOpenMobile;

	return (
		<Sidebar.Root collapsible="icon">
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton asChild size="noPadding">
							<Link to="/dashboard">
								<Logo
									size={isSidebarOpen ? "default" : "sm"}
									className={cn(isSidebarOpen && "text-xs w-full text-center")}
								 />
							</Link>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
			<Sidebar.Content>
				<NavMain />
			</Sidebar.Content>

			<Sidebar.Footer>
				<NavUser user={user} />
			</Sidebar.Footer>
		</Sidebar.Root>
	);
};
