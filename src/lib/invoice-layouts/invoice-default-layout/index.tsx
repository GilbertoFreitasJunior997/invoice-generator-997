import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoiceDefaultLayoutProps } from "./types";

const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 10,
		color: "#1a1a1a",
	},
	header: {
		marginBottom: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: 700,
		marginBottom: 8,
		color: "#0a0a0a",
	},
	invoiceNumber: {
		fontSize: 11,
		color: "#666",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 9,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		color: "#888",
		marginBottom: 8,
	},
	infoText: {
		fontSize: 10,
		lineHeight: 1.6,
		color: "#333",
	},
	infoTextBold: {
		fontSize: 11,
		fontWeight: 600,
		marginBottom: 4,
		color: "#0a0a0a",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	column: {
		flex: 1,
	},
	table: {
		marginTop: 32,
		marginBottom: 24,
	},
	tableHeader: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderBottomColor: "#0a0a0a",
		paddingBottom: 8,
		marginBottom: 12,
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e5e5",
	},
	tableColDescription: {
		flex: 3,
	},
	tableColRate: {
		flex: 1,
		textAlign: "right",
	},
	tableColQuantity: {
		flex: 1,
		textAlign: "right",
	},
	tableColAmount: {
		flex: 1,
		textAlign: "right",
	},
	tableHeaderText: {
		fontSize: 9,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		color: "#0a0a0a",
	},
	tableCellText: {
		fontSize: 10,
		color: "#333",
	},
	totalSection: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 2,
		borderTopColor: "#0a0a0a",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 8,
	},
	totalLabel: {
		fontSize: 11,
		fontWeight: 600,
		marginRight: 32,
		color: "#0a0a0a",
	},
	totalAmount: {
		fontSize: 11,
		fontWeight: 600,
		width: 80,
		textAlign: "right",
		color: "#0a0a0a",
	},
	footer: {
		position: "absolute",
		bottom: 40,
		left: 40,
		right: 40,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "#e5e5e5",
	},
	footerText: {
		fontSize: 9,
		color: "#888",
		textAlign: "center",
	},
});

export const InvoiceDefaultLayout = ({
	user,
	client,
	services,
}: InvoiceDefaultLayoutProps) => {
	const quantity = 10;
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
		month: "long",
		day: "numeric",
	});

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.title}>INVOICE</Text>
					<Text style={styles.invoiceNumber}>
						Invoice #{client.currentInvoiceNumber}
					</Text>
					<Text style={styles.invoiceNumber}>{invoiceDate}</Text>
				</View>

				<View style={styles.row}>
					<View style={styles.column}>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>From</Text>
							<Text style={styles.infoTextBold}>{user.name}</Text>
							<Text style={styles.infoText}>{user.email}</Text>
							<Text style={styles.infoText}>{user.addressLine1}</Text>
						</View>
					</View>

					<View style={styles.column}>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Bill To</Text>
							<Text style={styles.infoText}>{client.name}</Text>
							{client.email && (
								<Text style={styles.infoText}>{client.email}</Text>
							)}
							<Text style={styles.infoTextBold}>{client.taxId}</Text>
							<Text style={styles.infoText}>{client.addressLine1}</Text>
						</View>
					</View>
				</View>

				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<View style={styles.tableColDescription}>
							<Text style={styles.tableHeaderText}>Description</Text>
						</View>
						<View style={styles.tableColRate}>
							<Text style={styles.tableHeaderText}>Rate</Text>
						</View>
						<View style={styles.tableColQuantity}>
							<Text style={styles.tableHeaderText}>Quantity</Text>
						</View>
						<View style={styles.tableColAmount}>
							<Text style={styles.tableHeaderText}>Amount</Text>
						</View>
					</View>

					{servicesWithQuantity.map((service) => (
						<View key={service.id} style={styles.tableRow}>
							<View style={styles.tableColDescription}>
								<Text style={styles.tableCellText}>{service.description}</Text>
							</View>
							<View style={styles.tableColRate}>
								<Text style={styles.tableCellText}>
									${service.rate.toFixed(2)}
								</Text>
							</View>
							<View style={styles.tableColQuantity}>
								<Text style={styles.tableCellText}>{service.quantity} hrs</Text>
							</View>
							<View style={styles.tableColAmount}>
								<Text style={styles.tableCellText}>
									${service.total.toFixed(2)}
								</Text>
							</View>
						</View>
					))}

					<View style={styles.totalSection}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Total:</Text>
							<Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
						</View>
					</View>
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Thank you for your business</Text>
				</View>
			</Page>
		</Document>
	);
};
