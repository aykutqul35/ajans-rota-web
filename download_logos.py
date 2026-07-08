import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

logos = {
    'ideasoft': 'https://www.ideasoft.com.tr/wp-content/themes/ideasoft2022/img/ideasoft-logo.svg',
    'ticimax': 'https://www.ticimax.com/assets/images/logo.svg',
    'ikas': 'https://ikas.com/images/logo.svg',
    'ciceksepeti': 'https://cdn.ciceksepeti.com/cicek-sepeti-logo.svg',
    'n11': 'https://upload.wikimedia.org/wikipedia/commons/4/41/N11_Logo.svg',
    'tsoft': 'https://www.tsoft.com.tr/Assets/img/t-soft-logo.svg'
}

for name, url in logos.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as response:
            with open(f"public/images/partners/{name}.svg", "wb") as f:
                f.write(response.read())
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")
