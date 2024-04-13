const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true
}));

// Read SSL certificate and key
const privateKey = fs.readFileSync('./certs/private.pem', 'utf8');
const certificate = fs.readFileSync('./certs/public.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Keycloak configuration
const initOptions = {
  url: 'https://kc2.ehrn.ehr.network/', // Keycloak server URL
  realm: 'ehrn-v2-sbx-ayushehr',       // Realm name
  clientId: 'Ayushehr'                 // Client ID
};

// Create Keycloak instance
const keycloak = new Keycloak({ store: {}, idpHint: 'idir' }, initOptions);

// Protect your application with Keycloak middleware
app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

// Route handler
app.get('/', keycloak.protect(), (req, res) => {
  res.send('Authenticated successfully!');
});

// Start HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
