import { getRouteApi, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { Badge } from "@/lib/components/badge";
import { Card } from "@/lib/components/card";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getInvoicesWithRelationsQueryOptions } from "@/lib/query-options/invoice.query-options";
import type { InvoiceSelectWithRelations } from "@/lib/schemas/invoice.schemas";
import { cn } from "@/lib/utils/cn";

const Route = getRouteApi("/_app/invoices/");

export const InvoiceList = () => {
	const { user } = Route.useLoaderData();
	const {
		data: invoicesWithRelations,
		isFetching: isInvoicesWithRelationsLoading,
	} = useServerQuery(getInvoicesWithRelationsQueryOptions({ userId: user.id }));

	return (
		<div className="max-w-4xl mx-auto space-y-2">
			<section>
				<h1 className="text-2xl font-bold">Invoices</h1>
				<p className="text-sm text-muted-foreground">
					Manage and track your invoices
				</p>
			</section>

			{isInvoicesWithRelationsLoading ? (
				<div>
					<Loader2Icon className="size-4 animate-spin" />
				</div>
			) : (
				<div>
					{invoicesWithRelations?.map((invoice) => (
						<InvoiceCard key={invoice.id} invoice={invoice} />
					))}
				</div>
			)}
		</div>
	);
};

const InvoiceCard = ({ invoice }: { invoice: InvoiceSelectWithRelations }) => {
	const formattedDate = format(new Date(invoice.invoicedAt), "MMM d, yyyy");

	const formattedAmount = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: invoice.items[0]?.currency ?? "USD",
	}).format(invoice.totalAmount);

	return (
		<Card.Root className="rounded-lg p-6">
			<div className="flex flex-col gap-3">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<h4 className="font-bold text-lg leading-tight">
								{invoice.clientSnapshot.clientId ? (
									<Link
										to="/clients"
										search={{
											editId: invoice.clientSnapshot.clientId,
										}}
										className="border-b border-dashed border-muted-foreground"
									>
										{invoice.clientSnapshot.name}
									</Link>
								) : (
									invoice.clientSnapshot.name
								)}
							</h4>
							<Badge variant="secondary" isGhost={true} className="rounded-md">
								#{invoice.invoiceNumber}
							</Badge>
						</div>
						{invoice.clientSnapshot.email && (
							<p className="text-sm text-muted-foreground">
								{invoice.clientSnapshot.email}
							</p>
						)}
					</div>
					<div className="flex gap-2">
						<Badge variant="warning" isGhost>
							pending
						</Badge>
					</div>
				</div>

				<div className="flex items-end justify-between">
					<div className="flex flex-col gap-1.5">
						<ul className="text-sm text-muted-foreground">
							{invoice.items.map((item) => {
								return (
									<li key={item.id}>
										{item.serviceId ? (
											<Link
												to="/services"
												search={{
													editId: item.serviceId,
												}}
												className={cn(
													"border-b border-dashed border-muted-foreground",
												)}
											>
												{item.name}
											</Link>
										) : (
											<span>{item.name}</span>
										)}
									</li>
								);
							})}
						</ul>

						<p className="text-xs text-muted-foreground">{formattedDate}</p>
					</div>

					<p className="text-xl font-bold leading-tight">{formattedAmount}</p>
				</div>
			</div>
		</Card.Root>
	);
};
