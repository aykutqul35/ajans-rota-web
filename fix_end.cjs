const fs = require('fs');
let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

c = c.replace(
  `      </div>
    </div>
  );
}`,
  `      </div>
    </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
