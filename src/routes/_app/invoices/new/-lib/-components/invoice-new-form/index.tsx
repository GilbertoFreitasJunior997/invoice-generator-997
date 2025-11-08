import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { Field } from "@/lib/components/field";
import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../../hooks/use-invoice-new-queries";
import { invoiceNewFormDefaultValues } from "../consts";

const normalizeCompanyName = (name: string) => {
	return name
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
};

export const InvoiceNewForm = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();

		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;

		const createInvoiceFileName = (
			invoiceNumber: number,
			clientName: string,
		) => {
			return `INV${invoiceNumber}-${normalizeCompanyName(clientName)}`;
		};

		const handleInvoiceNumberChange = (invoiceNumber: number) => {
			if (!invoiceNumber) {
				return;
			}

			const selectedClientId = form.getFieldValue("clientId");
			const selectedClient = clients?.find(
				(client) => client.id === selectedClientId,
			);
			if (!selectedClient) {
				return;
			}

			form.setFieldValue(
				"fileName",
				createInvoiceFileName(invoiceNumber, selectedClient.name),
			);
		};

		const handleClientChange = (clientId: string) => {
			const currentInvoiceNumber = form.getFieldValue("invoiceNumber");
			if (!currentInvoiceNumber) {
				return;
			}

			const client = clients?.find((client) => client.id === clientId);
			if (!client) {
				return;
			}

			form.setFieldValue(
				"fileName",
				createInvoiceFileName(currentInvoiceNumber, client.name),
			);
		};

		return (
			<form.Root form={form} className="grow-0 overflow-y-auto">
				<form.Group>
					<form.AppField
						name="clientId"
						listeners={{
							onChange: ({ value }) => handleClientChange(value),
						}}
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
						name="services"
						mode="array"
						children={(field) => {
							return (
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2 justify-between">
										<span className="text-sm font-medium">Services</span>

										<Button
											variant="outline"
											size="xs"
											onClick={() =>
												field.pushValue({
													serviceId: "",
													quantity: 1,
												})
											}
										>
											<PlusIcon className="size-3" />
											Add Service
										</Button>
									</div>

									<AnimatePresence initial={false}>
										{field.state.value.map((_, index) => {
											const showRemoveButton = field.state.value.length > 1;

											return (
												<motion.div
													key={index}
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.2 }}
												>
													<div className="flex flex-col gap-2 bg-muted/50 border border-border rounded-md	px-2 py-3">
														<div className="flex items-center justify-between">
															<span className="text-sm text-muted-foreground">
																Service
															</span>

															{showRemoveButton && (
																<Button
																	variant="ghost"
																	size="icon-sm"
																	onClick={() => field.removeValue(index)}
																>
																	<TrashIcon />
																</Button>
															)}
														</div>
														<fieldset className="grid grid-cols-3 gap-2">
															<form.AppField
																name={`services[${index}].serviceId`}
																children={(subField) => (
																	<subField.SelectInput
																		items={services?.map((service) => ({
																			label: service.name,
																			value: service.id,
																		}))}
																		isLoading={isServicesLoading}
																		rootClassName="col-span-2"
																	/>
																)}
															/>

															<form.AppField
																name={`services[${index}].quantity`}
																children={(subField) => (
																	<subField.NumberInput
																		prefix="qty: "
																		rootClassName="col-span-1"
																	/>
																)}
															/>
														</fieldset>
													</div>
												</motion.div>
											);
										})}
									</AnimatePresence>
								</div>
							);
						}}
					/>

					<form.AppField
						name="invoicedAt"
						children={(field) => <field.DateInput label="Invoice Date" />}
					/>

					<form.AppField
						name="dueDate"
						children={(field) => (
							<field.DateInput
								label="Due Date"
								placeholder=" "
								description="Leave blank if you don't want to set a due date"
							/>
						)}
					/>

					<fieldset className="flex gap-2">
						<form.AppField
							name="fileName"
							children={(field) => (
								<field.TextInput
									label="File Name"
									placeholder="INV1-Acme-Inc"
									rootClassName="grow"
								/>
							)}
						/>

						<form.AppField
							name="invoiceNumber"
							listeners={{
								onChange: ({ value }) => handleInvoiceNumberChange(value),
							}}
							children={(field) => (
								<field.NumberInput
									label="Invoice Number"
									min={1}
									allowNegative={false}
									rootClassName="w-fit"
								/>
							)}
						/>
					</fieldset>
					<Field.Description
						className="w-full"
						description="Invoice number is automatically generated from the last invoice number."
					/>
				</form.Group>
			</form.Root>
		);
	},
});
