/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Kinturi'

const UnsubscribeConfirmationEmail = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been unsubscribed from {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You've been unsubscribed</Heading>
        <Text style={text}>
          We're confirming that your email address has been removed from the {SITE_NAME} mailing list.
          You will no longer receive newsletters or marketing emails from us.
        </Text>
        <Text style={text}>
          If this was a mistake, you can re-subscribe at any time from the {SITE_NAME} website.
        </Text>
        <Text style={footer}>
          With warmth,<br />The {SITE_NAME} team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: UnsubscribeConfirmationEmail,
  subject: `You've been unsubscribed from ${SITE_NAME}`,
  displayName: 'Unsubscribe confirmation',
  previewData: {},
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
  color: '#2B2F38',
}
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
const footer = { fontSize: '13px', color: '#999999', margin: '36px 0 0', lineHeight: '1.6' }
