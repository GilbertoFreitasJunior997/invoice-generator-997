import { createContext, type PropsWithChildren, useContext } from "react";

export type FormRootContext = {
	isLoading?: boolean;
};

export const formRootContextDefaultValues: FormRootContext = {
	isLoading: false,
};

export const formRootContext = createContext<FormRootContext>(
	formRootContextDefaultValues,
);

export const FormRootProvider = ({
	children,
	isLoading,
}: PropsWithChildren<FormRootContext>) => {
	return (
		<formRootContext.Provider value={{ isLoading: isLoading ?? false }}>
			{children}
		</formRootContext.Provider>
	);
};

export const useFormRootContext = () => {
	const context = useContext(formRootContext);

	if (!context) {
		return formRootContextDefaultValues;
	}

	return context;
};
