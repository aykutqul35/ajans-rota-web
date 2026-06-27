const fs = require('fs');
let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const clientPollStart = `            if (res.ok) {
              const data = await res.json();`;
const clientPollNew = `            if (res.status === 401) {
              clearInterval(intervalId);
              console.error("Client token invalid or expired. Stopping polling.");
              return;
            }
            if (res.ok) {
              const data = await res.json();`;

if (clientCode.includes(clientPollStart)) {
  clientCode = clientCode.replace(clientPollStart, clientPollNew);
  fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);
  console.log("Client polling 401 fix applied.");
}
