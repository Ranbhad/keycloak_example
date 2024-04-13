// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { Dialog, DialogTitle, DialogContent, Card } from '@mui/material';
// import { Button } from 'primereact/button';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import Keycloak from 'keycloak-js';
// import { httpClient } from './HttpClient';

// const initOptions = {
//   url: 'http://localhost:8080/',
//   realm: 'myRealm',
//   clientId: 'react',
// };
// const keycloak = new Keycloak(initOptions);

// keycloak.init({
//   onLoad: 'check-sso',
//   checkLoginIframe: true,
//   pkceMethod: 'S256'
// }).then((auth) => {
//   if (!auth) {
//     keycloak.init({ onLoad: 'login-required' }); // If not authenticated, require login
//   } else {
//     console.info("Authenticated");
//     console.log('auth', auth);
//     console.log('Keycloak', keycloak);
//     console.log('Access Token', keycloak.token);
//     httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
//     keycloak.onTokenExpired = () => {
//       console.log('token expired');
//     };
//   }
// }, () => {
//   console.error("Authentication Failed");
// });

// function App() {
//   const [infoMessage, setInfoMessage] = useState('');
//   const [isCreateAccountDialogVisible, setIsCreateAccountDialogVisible] = useState(false);
//   const [newAccountName, setNewAccountName] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadUserInfo();
//   }, []);

//   const loadUserInfo = () => {
//     keycloak.loadUserInfo().then(userInfo => {
//       httpClient.get(`{{keycloak}}/realms/:realm/orgs`) // Using relative path
//         .then(response => {
//           setAccounts(response.data);
//           setIsLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching accounts:', error);
//           setIsLoading(false);
//         });
//     });
//   };

//   const handleCreateAccount = () => {
//     console.log("Creating new account:", newAccountName);
//     setIsCreateAccountDialogVisible(false);
//     setInfoMessage(`New account "${newAccountName}" created successfully.`);
//     setNewAccountName('');
//   };
//   return (
//     <div className="App">
//       <div className='grid'>
//         <div className='col-12'>
//           <h1> Manage Customer Account</h1>
//         </div>
//       </div>
//       <div className="grid"></div>
//       <div className='grid'>
//         <div className='col-1'></div>
//         <div className='col-2'>
//           <div className="col">
//             <Button onClick={() => setIsCreateAccountDialogVisible(true)}
//               className="m-1 custom-btn-style"
//               label='Account+'
//               severity="success" />
//               <Button onClick={() => { keycloak.logout() }}
//                   className="m-1 custom-btn-style"
//                   label='Logout'
//                   severity="danger" />
//           </div>
//         </div>
//         <div className='col-6'>
//            <Card>
//              {isLoading ? (
//               <p>Loading...</p>
//             ) : (
//               <DataTable value={accounts}>
//                 <Column field="accountId" header="Account ID"></Column>
//               </DataTable>
//             )}
//           </Card>
//         </div>
//         <div className='col-2'></div>
//       </div>
//       <Dialog style={{width: '100%'}} open={isCreateAccountDialogVisible} onClose={() => setIsCreateAccountDialogVisible(false)} > 
//         <DialogTitle>Add Test Results</DialogTitle>
//         <DialogContent>
//           <div className="p-fluid">
//             <div className="p-field" style={{ width: '100%' }}> 
//               <label htmlFor="newAccountName">Account Name</label>
//               <InputText id="newAccountName" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} />
//             </div>
//             <div className="p-mt-2">
//               <Button label="Create" onClick={handleCreateAccount} style={{ width: '100px' }} /> 
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { httpClient } from './HttpClient';

import Keycloak from 'keycloak-js';

/*
  Init Options
*/
let initOptions = {
  url: 'https://kc2.ehrn.ehr.network/', // Using relative path for the proxy
  realm: 'ehrn-v2-sbx-ayushehr',
  clientId: 'Ayushehr',
  // url: 'http://localhost:8080/',
  // realm: 'myRealm',
  // clientId: 'react',
}

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: 'login-required', // Supported values: 'check-sso' , 'login-required'
  checkLoginIframe: true,
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    /* Remove below logs if you are using this on production */
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    /* http client will use this header in every request it sends */
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  /* Notify the user if necessary */
  console.error("Authentication Failed");
});

function App() {

  const [infoMessage, setInfoMessage] = useState('');

  /* To demonstrate : http client adds the access token to the Authorization header */
  const callBackend = () => {
    httpClient.get('https://mockbin.com/request')

  };

  return (
    <div className="App">
      <div className='grid'>
        <div className='col-12'>
          <h1>My Secured React App</h1>
        </div>
      </div>
      <div className="grid">

      </div>

      <div className='grid'>
        <div className='col-1'></div>
        <div className='col-2'>
          <div className="col">
            <Button onClick={() => { setInfoMessage(kc.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }}
              className="m-1 custom-btn-style"
              label='Is Authenticated' />

            <Button onClick={() => { kc.login() }}
              className='m-1 custom-btn-style'
              label='Login'
              severity="success" />

            <Button onClick={() => { setInfoMessage(kc.token) }}
              className="m-1 custom-btn-style"
              label='Show Access Token'
              severity="info" />

            <Button onClick={() => { setInfoMessage(JSON.stringify(kc.tokenParsed)) }}
              className="m-1 custom-btn-style"
              label='Show Parsed Access token'
              severity="warning" />

            <Button onClick={() => { setInfoMessage(kc.isTokenExpired(5).toString()) }}
              className="m-1 custom-btn-style"
              label='Check Token expired'
              severity="info" />

            <Button onClick={() => { kc.updateToken(10).then((refreshed) => { setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, (e) => { setInfoMessage('Refresh Error') }) }}
              className="m-1 custom-btn-style"
              label='Update Token (if about to expire)' />  {/** 10 seconds */}

            <Button onClick={callBackend}
              className='m-1 custom-btn-style'
              label='Send HTTP Request'
              severity="success" />

            <Button onClick={() => { kc.logout({ redirectUri: 'http://localhost:3000/' }) }}
              className="m-1 custom-btn-style"
              label='Logout'
              severity="danger" />

            <Button onClick={() => { setInfoMessage(kc.hasRealmRole('admin').toString()) }}
              className="m-1 custom-btn-style"
              label='has realm role "Admin"'
              severity="info" />

            <Button onClick={() => { setInfoMessage(kc.hasResourceRole('test').toString()) }}
              className="m-1 custom-btn-style"
              label='has client role "test"'
              severity="info" />

          </div>
        </div>
        <div className='col-6'>

          <Card>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </Card>
        </div>

        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App