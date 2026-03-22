import sys
import re

html_path = 'c:/Users/user/Desktop/truck-parking-ai-main/template/LandingPage1/code.html'
jsx_path = 'c:/Users/user/Desktop/truck-parking-ai-main/dashboard/src/pages/Landing.jsx'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

body_start = html.find('<!-- TopNavBar -->')
body_end = html.rfind('</body>')
body = html[body_start:body_end]

body = body.replace('class=', 'className=')
body = body.replace('for=', 'htmlFor=')
body = body.replace('<!--', '{/*').replace('-->', '*/}')

# Fix style tags
def replace_style(m):
    val = m.group(1)
    if 'font-variation-settings' in val:
        return 'style={{ fontVariationSettings: "\\\'FILL\\\' 1" }}'
    return m.group(0)

body = re.sub(r'style="([^"]+)"', replace_style, body)

# Fix empty/self-closing tags
def fix_img(m):
    content = m.group(1)
    if content.strip().endswith('/'):
        return m.group(0)
    return f'<img{content} />'

body = re.sub(r'<img([^>]+)>', fix_img, body)

# Fix self-closing input tags if any
body = re.sub(r'<input([^>]+)(?<!/)>', r'<input\1 />', body)

jsx = """import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="selection:bg-secondary-fixed selection:text-on-secondary-fixed">
""" + body + """
    </div>
  );
}
"""

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

print("Conversion complete.")
