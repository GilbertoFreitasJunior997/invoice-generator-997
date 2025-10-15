import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SidebarStore = {
	isOpen: boolean;
	isOpenMobile: boolean;
	setIsOpenMobile: (isOpen: boolean) => void;
	setIsOpen: (isOpen: boolean) => void;
	toggleSidebar: () => void;
};

export const useSidebar = create<SidebarStore>()(
	persist(
		(set) => ({
			isOpen: false,
			isOpenMobile: false,
			setIsOpenMobile: (isOpen) => {
				set((state) => ({ ...state, isOpenMobile: isOpen }));
			},
			setIsOpen: (isOpen) => {
				set((state) => ({ ...state, isOpen: isOpen }));
			},
			toggleSidebar: () => {
				set((state) => ({
					...state,
					isOpen: !state.isOpen,
				}));
			},
		}),
		{
			name: "sidebar",
		},
	),
);
