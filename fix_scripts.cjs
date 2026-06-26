const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldSafeAppend = `    const safeAppend = (parent, child) => {
      try {
        if (child.tagName && child.tagName.toLowerCase() === 'script') {
          let content = child.innerHTML;
          if (/<script|<!--/i.test(content)) {
            console.warn('Admin panelinden gelen script hatalı formatlanmış (HTML etiketleri içeriyor). Otomatik temizleniyor...');
            content = content.replace(/<script[^>]*>/gi, '').replace(/<\\/script>/gi, '').replace(/<!--/g, '').replace(/-->/g, '');
            child.innerHTML = content.trim();
          }
          // Script'leri asenkron ekleyerek (setTimeout) olası JS Sözdizimi (Syntax) hatalarının 
          // React'ı çökertmesini (Uncaught SyntaxError) engelliyoruz.
          setTimeout(() => {
            try {
              try { parent.appendChild(child); } catch (e) { console.error("Error appending child:", e); }
            } catch (err) {
              console.error('Dynamic script parse/append error:', err);
            }
          }, 0);
        } else {
          try { parent.appendChild(child); } catch (e) { console.error("Error appending child:", e); }
        }
      } catch (e) {
        console.error('Dynamic tracker append error. Invalid tag in admin panel.', e);
      }
    };`;

const newSafeAppend = `    const safeAppend = (parent, child) => {
      try {
        if (child.tagName && child.tagName.toLowerCase() === 'script') {
          let content = child.innerHTML;
          // EGER HTML KODU ICERIYORSA (kullanici script yerine direk kopyala yapistir yaptiysa)
          if (/<script|<noscript|<iframe|<!--/i.test(content)) {
            console.warn('Admin panelinden gelen kod HTML iceriyor. Güvenli şekilde parse ediliyor...');
            setTimeout(() => {
                try {
                    const temp = document.createElement('div');
                    temp.innerHTML = content;
                    Array.from(temp.childNodes).forEach(node => {
                        if (node.tagName && node.tagName.toLowerCase() === 'script') {
                            const newScript = document.createElement('script');
                            Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                            newScript.innerHTML = node.innerHTML;
                            parent.appendChild(newScript);
                        } else if (node.nodeType === 1) { // Element node (noscript, iframe vb)
                            parent.appendChild(node);
                        }
                    });
                } catch(e) { console.error("HTML script parse error", e); }
            }, 0);
            return;
          }
          
          setTimeout(() => {
            try { parent.appendChild(child); } catch (err) {}
          }, 0);
        } else {
          parent.appendChild(child);
        }
      } catch (e) {
        console.error('Dynamic tracker append error', e);
      }
    };`;

code = code.replace(oldSafeAppend, newSafeAppend);
fs.writeFileSync('src/App.jsx', code);
