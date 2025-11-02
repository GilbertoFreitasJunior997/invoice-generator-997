import {
	Document,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { InvoiceDefaultLayoutProps } from "@/lib/invoice-layouts/invoice-default-layout/types";
import { formatDbDate } from "@/lib/utils/date.utils";

const styles = StyleSheet.create({
	page: {
		padding: 50,
		fontSize: 11,
		color: "#1a1a1a",
		fontFamily: "Helvetica",
	},
	topHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 20,
	},
	companyName: {
		fontSize: 14,
		fontWeight: 600,
		color: "#2a2a2a",
	},
	headerRight: {
		alignItems: "flex-end",
	},
	invoiceNumberText: {
		fontSize: 11,
		color: "#4a4a4a",
		marginBottom: 4,
	},
	invoiceDateText: {
		fontSize: 11,
		color: "#4a4a4a",
	},
	separator: {
		height: 1,
		backgroundColor: "#3a3a3a",
		marginBottom: 30,
	},
	invoiceTitle: {
		fontSize: 36,
		fontWeight: 700,
		color: "#1a1a1a",
		marginBottom: 40,
		letterSpacing: 1,
	},
	addressRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 40,
	},
	addressColumn: {
		flex: 1,
	},
	addressSection: {
		marginRight: 40,
	},
	sectionTitle: {
		fontSize: 9,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: 1,
		color: "#999",
		marginBottom: 12,
	},
	userName: {
		fontSize: 12,
		fontWeight: 700,
		color: "#1a1a1a",
		marginBottom: 6,
	},
	clientName: {
		fontSize: 12,
		fontWeight: 700,
		color: "#1a1a1a",
		marginBottom: 6,
	},
	userInfo: {
		fontSize: 11,
		lineHeight: 1.8,
		color: "#4a4a4a",
	},
	clientInfo: {
		fontSize: 11,
		lineHeight: 1.8,
		color: "#4a4a4a",
	},
	table: {
		marginBottom: 30,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		paddingVertical: 12,
		paddingHorizontal: 8,
		marginBottom: 0,
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 14,
		paddingHorizontal: 8,
		borderBottomWidth: 0,
	},
	tableColItem: {
		flex: 3,
		textAlign: "left",
	},
	tableColQuantity: {
		flex: 1,
		textAlign: "center",
	},
	tableColRate: {
		flex: 1.5,
		textAlign: "right",
	},
	tableColAmount: {
		flex: 1.5,
		textAlign: "right",
	},
	tableHeaderText: {
		fontSize: 9,
		fontWeight: 700,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		color: "#1a1a1a",
	},
	tableCellText: {
		fontSize: 11,
		color: "#2a2a2a",
		lineHeight: 1.6,
	},
	totalSeparator: {
		height: 1,
		backgroundColor: "#3a3a3a",
		marginTop: 20,
		marginBottom: 20,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 40,
	},
	totalLabel: {
		fontSize: 12,
		fontWeight: 600,
		color: "#1a1a1a",
	},
	totalAmount: {
		fontSize: 13,
		fontWeight: 700,
		color: "#1a1a1a",
	},
});

export const InvoiceDefaultLayout = ({
	invoiceNumber,
	user,
	client,
	services,
	userLogo: _userLogo,
}: InvoiceDefaultLayoutProps) => {
	const quantity = 1;
	const servicesWithQuantity = services.map((service) => ({
		...service,
		quantity,
		total: service.rate * quantity,
	}));

	const total = servicesWithQuantity.reduce(
		(sum, service) => sum + service.total,
		0,
	);

	const invoiceDate = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const clientLocation =
		client.city && client.state
			? `${client.city}, ${client.state}`
			: client.city || client.state || "";

	const userLocation =
		user.city && user.state
			? `${user.city}, ${user.state}`
			: user.city || user.state || "";

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.topHeader}>
					<Text style={styles.companyName}>{user.name}</Text>
					<View style={styles.headerRight}>
						<Text style={styles.invoiceNumberText}>#{invoiceNumber}</Text>
						<Text style={styles.invoiceDateText}>{invoiceDate}</Text>
					</View>
				</View>

				<View style={styles.separator} />

				<Text style={styles.invoiceTitle}>INVOICE</Text>

				<View style={styles.addressRow}>
					<View style={[styles.addressColumn, styles.addressSection]}>
						<Text style={styles.sectionTitle}>FROM</Text>
						<Text style={styles.userName}>{user.name}</Text>
						{user.addressLine1 && (
							<Text style={styles.userInfo}>{user.addressLine1}</Text>
						)}
						{user.addressLine2 && (
							<Text style={styles.userInfo}>{user.addressLine2}</Text>
						)}
						{userLocation && (
							<Text style={styles.userInfo}>{userLocation}</Text>
						)}
						{user.zip && <Text style={styles.userInfo}>{user.zip}</Text>}
					</View>

					<View style={styles.addressColumn}>
						<Text style={styles.sectionTitle}>BILLED TO</Text>
						<Text style={styles.clientName}>{client.name}</Text>
						{client.addressLine1 && (
							<Text style={styles.clientInfo}>{client.addressLine1}</Text>
						)}
						{client.addressLine2 && (
							<Text style={styles.clientInfo}>{client.addressLine2}</Text>
						)}
						{clientLocation && (
							<Text style={styles.clientInfo}>{clientLocation}</Text>
						)}
						{client.zip && <Text style={styles.clientInfo}>{client.zip}</Text>}
					</View>
				</View>

				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<View style={styles.tableColItem}>
							<Text style={styles.tableHeaderText}>ITEM</Text>
						</View>
						<View style={styles.tableColQuantity}>
							<Text style={styles.tableHeaderText}>QUANTITY</Text>
						</View>
						<View style={styles.tableColRate}>
							<Text style={styles.tableHeaderText}>RATE</Text>
						</View>
						<View style={styles.tableColAmount}>
							<Text style={styles.tableHeaderText}>AMOUNT</Text>
						</View>
					</View>

					{servicesWithQuantity.map((service) => (
						<View key={service.id} style={styles.tableRow}>
							<View style={styles.tableColItem}>
								<Text style={styles.tableCellText}>{service.description}</Text>
							</View>
							<View style={styles.tableColQuantity}>
								<Text style={styles.tableCellText}>{service.quantity}</Text>
							</View>
							<View style={styles.tableColRate}>
								<Text style={styles.tableCellText}>
									${service.rate.toFixed(2)}
								</Text>
							</View>
							<View style={styles.tableColAmount}>
								<Text style={styles.tableCellText}>
									${service.total.toFixed(2)}
								</Text>
							</View>
						</View>
					))}
				</View>

				<View style={styles.totalSeparator} />
				<View style={styles.totalRow}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
				</View>
			</Page>
		</Document>
	);
};

export const Route = createFileRoute("/_app/invoices/dev-test/")({
	component: RouteComponent,
	ssr: false,
});

const invoiceSampleData = {
	invoiceNumber: 1,
	user: {
		id: "8a08b683-e8f2-410a-8eda-fb53d2b62266",
		name: "Gilberto de Freitas",
		avatarUrl:
			"https://workoscdn.com/images/v1/DwzCIDxpe_khr850RkyRdMZLIehq7BdiKX3zrAvBrLs",
		email: "gilbertofreitas997@gmail.com",
		logoKey: null,
		currentInvoiceNumber: 1,
		taxId: "",
		addressLine1: "Rua Tapajós 519, Vila Mariana",
		addressLine2: "",
		city: "Garça",
		state: "São Paulo",
		country: "Brazil",
		zip: "17400-114",
		workOsId: "user_01K73CENTEMYDWM7TMH14RREYW",
		createdAt: formatDbDate(),
		updatedAt: formatDbDate(),
	},
	client: {
		id: "f738572f-e4f9-47dc-89d9-88a9a116113f",
		name: "Crewfare",
		email: "accounting@crewfare.com",
		taxId: "",
		addressLine1: "2678 Edgewater Ct",
		addressLine2: "",
		city: "Weston",
		state: "FL",
		country: "USA",
		zip: "33332",
		userId: "8a08b683-e8f2-410a-8eda-fb53d2b62266",
		createdAt: formatDbDate(),
		updatedAt: formatDbDate(),
	},
	services: [
		{
			id: "67015a88-c2e8-40f3-9ae6-6a6cff9f0427",
			name: "Crewfare Role",
			description: "Software Development",
			rate: 1200,
			currency: "USD",
			userId: "8a08b683-e8f2-410a-8eda-fb53d2b62266",
			createdAt: formatDbDate(),
			updatedAt: formatDbDate(),
		},
	],
} satisfies InvoiceDefaultLayoutProps;

function RouteComponent() {
	const count = useRef(0);
	useEffect(() => {
		count.current++;
	}, []);

	return (
		<PDFViewer key={count.current} className="w-full grow h-full">
			<InvoiceDefaultLayout
				invoiceNumber={invoiceSampleData.invoiceNumber}
				user={invoiceSampleData.user}
				client={invoiceSampleData.client}
				services={invoiceSampleData.services}
			/>
		</PDFViewer>
	);
}
