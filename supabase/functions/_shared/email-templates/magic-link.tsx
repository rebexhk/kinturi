/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your sign-in link</Heading>
        <Text style={text}>
          Click the button below to sign in to {siteName}. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Sign in
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", color: '#2B2F38' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '32px',
  fontWeight: 500 as const,
  color: '#2B2F38',
  margin: '0 0 24px',
}
const text = {
  fontSize: '15px',
  color: '#686D78',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: '#506E8C',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500 as const,
  borderRadius: '6px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  letterSpacing: '0.02em',
}
const footer = { fontSize: '12px', color: '#999999', margin: '36px 0 0', lineHeight: '1.5' }
