import { useStore } from "zustand";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { useSidebar } from "@/lib/stores/sidebar.store";

const getState = (isOpen: boolean) => (isOpen ? "expanded" : "collapsed");

export const useSidebarState = () => {
	const isMobile = useIsMobile();
	const isOpen = useStore(useSidebar, (s) => s.isOpen);
	const isOpenMobile = useStore(useSidebar, (s) => s.isOpenMobile);

	return isMobile ? getState(isOpenMobile) : getState(isOpen);
};
