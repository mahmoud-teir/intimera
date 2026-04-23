import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from "@react-email/components";

interface PasswordResetEmailProps {
	userName?: string;
	appName?: string;
	resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
	userName = "there",
	appName = "Intimera",
	resetUrl,
}) => (
	<Html>
		<Head />
		<Preview>Reset your password for {appName}</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Reset Password</Heading>
				</Section>
				<Section style={content}>
					<Text style={text}>Hi {userName},</Text>
					<Text style={text}>
						Someone recently requested a password change for your {appName} account. If this was you, you can set a new password here:
					</Text>
					<Button style={button} href={resetUrl}>
						Reset Password
					</Button>
					<Text style={text}>
						If you don't want to change your password or didn't request this, just ignore and delete this message.
					</Text>
				</Section>
				<Hr style={hr} />
				<Section style={footer}>
					<Text style={footerText}>
						To keep your account secure, please don't forward this email to anyone.
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
	backgroundColor: "#444", // Neutral dark
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

export default PasswordResetEmail;
