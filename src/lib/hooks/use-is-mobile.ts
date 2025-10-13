import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mobileMediaQueryList = window.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
		);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		mobileMediaQueryList.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		return () => mobileMediaQueryList.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
};
