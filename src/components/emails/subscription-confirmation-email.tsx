import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from "@react-email/components";

interface SubscriptionConfirmationEmailProps {
	userName: string;
	appName?: string;
	planName: string;
	dashboardUrl: string;
}

export const SubscriptionConfirmationEmail: React.FC<SubscriptionConfirmationEmailProps> = ({
	userName,
	appName = process.env.NEXT_PUBLIC_APP_NAME || "Intimera",
	planName = "Premium",
	dashboardUrl,
}) => (
	<Html>
		<Head />
		<Preview>Your {appName} {planName} subscription is active!</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Subscription Confirmed</Heading>
				</Section>
				<Section style={content}>
					<Text style={text}>Hi {userName},</Text>
					<Text style={text}>
						Thank you for subscribing to the <strong>{planName}</strong> plan on <strong>{appName}</strong>. Your subscription is now active!
					</Text>
					<Text style={text}>
						You and your partner now have full access to our premium guided exercises, deeper analytics, and exclusive content to further strengthen your relationship.
					</Text>
					<Button style={button} href={dashboardUrl}>
						Go to Dashboard
					</Button>
					<Text style={text}>
						If you have any questions or need support, feel free to reach out to our team at any time.
					</Text>
				</Section>
				<Hr style={hr} />
				<Section style={footer}>
					<Text style={footerText}>
						You're receiving this email because you recently upgraded your {appName} account.
					</Text>
					<Text style={footerText}>
						© {new Date().getFullYear()} {appName}. All rights reserved.
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);

const main = {
	backgroundColor: "#FAF9F6",
	fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "580px",
};

const header = {
	padding: "32px",
	backgroundColor: "#A96856", // Brand primary
	borderRadius: "8px 8px 0 0",
};

const h1 = {
	color: "#ffffff",
	fontSize: "24px",
	fontWeight: "600",
	lineHeight: "1.2",
	margin: "0",
	textAlign: "center" as const,
};

const content = {
	padding: "32px",
	backgroundColor: "#ffffff",
	borderLeft: "1px solid #eaeaea",
	borderRight: "1px solid #eaeaea",
};

const text = {
	color: "#333",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "16px 0",
};

const button = {
	backgroundColor: "#7F9487", // Sage-600
	borderRadius: "6px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "100%",
	padding: "14px 0",
	margin: "24px 0",
};

const hr = {
	borderColor: "#eaeaea",
	margin: "0",
};

const footer = {
	padding: "32px",
	backgroundColor: "#ffffff",
	borderLeft: "1px solid #eaeaea",
	borderRight: "1px solid #eaeaea",
	borderBottom: "1px solid #eaeaea",
	borderRadius: "0 0 8px 8px",
};

const footerText = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "16px",
	margin: "4px 0",
	textAlign: "center" as const,
};

export default SubscriptionConfirmationEmail;
