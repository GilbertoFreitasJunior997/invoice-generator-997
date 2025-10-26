import z from "zod";

export const invoiceGenerationFormSchema = z.object({
	clientId: z.string().min(1),
	servicesIds: z.array(z.string()).min(1),
});
