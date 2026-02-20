# Hotel Tarasha - Contact Server

This small Express server accepts POST `/contact` and sends an email via SMTP (Nodemailer).

Quick start (local):

1. Copy `.env.example` to `.env` and set your SMTP credentials and `NOTIFY_EMAIL`.
2. Install dependencies:

```bash
cd server
npm install
```

3. Start server:

```bash
npm run dev   # if you have nodemon
# or
npm start
```

4. In your frontend, set the contact form `data-endpoint` to your server URL (e.g. `http://localhost:3000/contact`), or keep `/contact` if you host frontend and backend on same domain.

Security notes:
- Use app passwords for Gmail (2FA) or a transactional email provider (SendGrid, Mailgun).
- Do not commit `.env` to git.
