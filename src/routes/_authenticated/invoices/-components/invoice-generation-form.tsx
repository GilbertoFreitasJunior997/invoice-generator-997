import { usePDF } from "@react-pdf/renderer";
import { useStore } from "@tanstack/react-form";
import { DownloadIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/lib/components/button";
import { Dialog } from "@/lib/components/dialog";
import { Form } from "@/lib/components/form";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import { getAllServicesQueryOptions } from "@/lib/query-options/service.query-options";
import type { ClientSelect } from "@/lib/schemas/client.schemas";
import { invoiceGenerationFormSchema } from "@/lib/schemas/invoice.schemas";
import type { ServiceSelect } from "@/lib/schemas/service.schemas";
import type { UserSelect } from "@/lib/schemas/user.schemas";
import { cn } from "@/lib/utils/cn";
import { useAppForm, withForm } from "@/lib/utils/forms.utils";
import { Route } from "../index";

const defaultValues = {
	clientId: "",
	servicesIds: [] as string[],
};

export const InvoiceGenerationForm = () => {
	const { user } = Route.useLoaderData();
	const { isCreating } = Route.useSearch();
	const isOpen = !!isCreating;

	const navigate = Route.useNavigate();

	const { data: clients, isFetching: isClientsLoading } = useServerQuery({
		...getAllClientsQueryOptions({
			userId: user.id,
		}),
		enabled: isOpen,
	});

	const { data: services, isFetching: isServicesLoading } = useServerQuery({
		...getAllServicesQueryOptions({
			userId: user.id,
		}),
		enabled: isOpen,
	});

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async () => {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			form.reset();

			navigate({
				search: { isCreating: undefined },
			});
		},
	});

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			navigate({
				search: { isCreating: undefined },
			});
		}
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Dialog.Content className="w-[90dvw] h-[90dvh]">
				<Dialog.Header>
					<Dialog.Title>Create Invoice</Dialog.Title>
				</Dialog.Header>

				<div className="flex gap-2 h-full">
					<Form.Root form={form} className="w-[30%] max-w-[400px]">
						<Form.Group className="">
							<form.AppField
								name="clientId"
								children={(field) => (
									<field.SelectInput
										label="Client"
										items={clients?.map((client) => ({
											label: client.name,
											value: client.id,
										}))}
										isLoading={isClientsLoading}
									/>
								)}
							/>
							<form.AppField
								name="servicesIds"
								children={(field) => (
									<field.ComboboxInput
										label="Services"
										items={services?.map((service) => ({
											label: service.name,
											value: service.id,
										}))}
										isLoading={isServicesLoading}
									/>
								)}
							/>
						</Form.Group>
					</Form.Root>

					<PDFSection
						form={form}
						clients={clients ?? []}
						services={services ?? []}
						user={user}
					/>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
};

const PDFSection = withForm({
	defaultValues,
	props: {} as {
		clients: ClientSelect[];
		services: ServiceSelect[];
		user: UserSelect;
	},
	render: function Render({ form, clients, services, user }) {
		const clientId = useStore(form.store, (s) => s.values.clientId);
		const servicesIds = useStore(form.store, (s) => s.values.servicesIds);

		const selectedClient = useMemo(
			() => clients.find((client) => client.id === clientId),
			[clientId, clients],
		);
		const selectedServices = useMemo(
			() => services.filter((service) => servicesIds.includes(service.id)),
			[servicesIds, services],
		);

		const [pdfInstance, updatePdf] = usePDF({
			document: undefined,
		});
		useEffect(() => {
			if (!selectedClient || !selectedServices.length) {
				return;
			}

			updatePdf(
				<InvoiceDefaultLayout
					user={user}
					client={selectedClient}
					services={selectedServices}
				/>,
			);
		}, [updatePdf, user, selectedClient, selectedServices]);

		if (!pdfInstance.url || !selectedClient || !selectedServices.length) {
			return <div />;
		}

		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="flex flex-col flex-1 h-full gap-1 max-w-3xl">
					<iframe
						src={pdfInstance.url}
						className="flex-1 h-full rounded-lg w-full"
						title="Invoice"
					/>
					<form.Subscribe
						selector={(state) => ({
							isSubmitting: state.isSubmitting,
							canSubmit: state.canSubmit,
						})}
					>
						{({ isSubmitting, canSubmit }) => {
							const isDisabled = isSubmitting || !canSubmit;

							return (
								<Button
									className="w-full"
									asChild
									onClick={() => {
										form.handleSubmit();
									}}
									disabled={isDisabled}
								>
									<a
										href={pdfInstance.url ?? ""}
										download="invoice.pdf"
										className={cn(
											isDisabled && "opacity-50 pointer-events-none",
										)}
										aria-disabled={isDisabled}
									>
										<DownloadIcon className="size-4" />
										{isSubmitting ? "Saving generated invoice..." : "Download"}
									</a>
								</Button>
							);
						}}
					</form.Subscribe>
				</div>
			</div>
		);
	},
});
