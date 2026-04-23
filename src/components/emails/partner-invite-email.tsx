import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from "react-email";

interface PartnerInviteEmailProps {
	inviterName: string;
	appName?: string;
	inviteUrl: string;
}

export const PartnerInviteEmail: React.FC<PartnerInviteEmailProps> = ({
	inviterName,
	appName = process.env.NEXT_PUBLIC_APP_NAME || "Intimera",
	inviteUrl,
}) => (
	<Html>
		<Head />
		<Preview>{inviterName} has invited you to join them on {appName}</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Invitation to {appName}</Heading>
				</Section>
				<Section style={content}>
					<Text style={text}>Hello!</Text>
					<Text style={text}>
						<strong>{inviterName}</strong> has invited you to join them on <strong>{appName}</strong>, a private sanctuary for connection and growth.
					</Text>
					<Text style={text}>
						Click the link below to accept the invitation, create your account, and link your profiles together.
					</Text>
					<Button style={button} href={inviteUrl}>
						Accept Invitation
					</Button>
					<Text style={text}>
						Or copy and paste this link into your browser:
					</Text>
					<Text style={linkText}>
						<a href={inviteUrl} style={link}>{inviteUrl}</a>
					</Text>
					<Text style={mutedText}>
						If you were not expecting this email, please ignore it. This invitation will expire.
					</Text>
				</Section>
				<Hr style={hr} />
				<Section style={footer}>
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
	backgroundColor: "#7F9487", // Sage-600
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
	backgroundColor: "#A96856",
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

const linkText = {
	fontSize: "14px",
	color: "#666",
	wordBreak: "break-all" as const,
};

const link = {
	color: "#A96856",
	textDecoration: "underline",
};

const mutedText = {
	fontSize: "14px",
	color: "#999",
	marginTop: "40px",
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

export default PartnerInviteEmail;
