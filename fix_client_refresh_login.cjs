const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Update useState
code = code.replace(
  "const [activeBrand, setActiveBrand] = useState('ecommerce');",
  "const [activeBrand, setActiveBrand] = useState(() => localStorage.getItem('local_client_brand') || 'ecommerce');"
);
code = code.replace(
  "const [isLoggedIn, setIsLoggedIn] = useState(false);",
  "const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('local_client_logged_in') === 'true');"
);

// 2. Update handleLogin (Success path)
const successPathOld = `        setActiveBrand(key);
        setIsLoggedIn(true);
      } else {`;
const successPathNew = `        setActiveBrand(key);
        setIsLoggedIn(true);
        localStorage.setItem('local_client_brand', key);
        localStorage.setItem('local_client_logged_in', 'true');
      } else {`;
code = code.replace(successPathOld, successPathNew);

// 3. Update handleLogin (Fallback matchedBrandKey path)
const fallbackMatchOld = `        if (matchedBrandKey) {
          setActiveBrand(matchedBrandKey);
          setIsLoggedIn(true);
        } else {`;
const fallbackMatchNew = `        if (matchedBrandKey) {
          setActiveBrand(matchedBrandKey);
          setIsLoggedIn(true);
          localStorage.setItem('local_client_brand', matchedBrandKey);
          localStorage.setItem('local_client_logged_in', 'true');
        } else {`;
code = code.replace(fallbackMatchOld, fallbackMatchNew);

// 4. Update handleLogin (Fallback default accounts path)
const fallbackEcommerceOld = `          if (u === expectedEcomUser && p === expectedEcomPass) {
            setActiveBrand('ecommerce');
            setIsLoggedIn(true);
          } else if (u === expectedB2bUser && p === expectedB2bPass) {`;
const fallbackEcommerceNew = `          if (u === expectedEcomUser && p === expectedEcomPass) {
            setActiveBrand('ecommerce');
            setIsLoggedIn(true);
            localStorage.setItem('local_client_brand', 'ecommerce');
            localStorage.setItem('local_client_logged_in', 'true');
          } else if (u === expectedB2bUser && p === expectedB2bPass) {`;
code = code.replace(fallbackEcommerceOld, fallbackEcommerceNew);

const fallbackB2bOld = `          } else if (u === expectedB2bUser && p === expectedB2bPass) {
            setActiveBrand('b2b');
            setIsLoggedIn(true);
          } else {`;
const fallbackB2bNew = `          } else if (u === expectedB2bUser && p === expectedB2bPass) {
            setActiveBrand('b2b');
            setIsLoggedIn(true);
            localStorage.setItem('local_client_brand', 'b2b');
            localStorage.setItem('local_client_logged_in', 'true');
          } else {`;
code = code.replace(fallbackB2bOld, fallbackB2bNew);

// 5. Update handleLogout
const logoutOld = `  const handleLogout = () => {
    localStorage.removeItem('client_token');
    setIsLoggedIn(false);
  };`;
const logoutNew = `  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('local_client_brand');
    localStorage.removeItem('local_client_logged_in');
    setIsLoggedIn(false);
  };`;
code = code.replace(logoutOld, logoutNew);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Client refresh login fixed");
