const fs = require('fs');
let html = fs.readFileSync('c:/Users/user/Desktop/truck-parking-ai-main/template/LandingPage1/code.html', 'utf8');

let bodyStart = html.indexOf('<!-- TopNavBar -->');
let bodyEnd = html.lastIndexOf('</body>');
let body = html.slice(bodyStart, bodyEnd);

body = body.replace(/class=/g, 'className=');
body = body.replace(/for=/g, 'htmlFor=');
body = body.replace(/<!--/g, '{/*').replace(/-->/g, '*/}');

// Fix self-closing images
body = body.replace(/<img(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return '<img' + p1 + ' />';
});

// Fix style tags
body = body.replace(/style="([^"]+)"/g, (match, p1) => {
    if (p1.includes('font-variation-settings')) {
        return 'style={{ fontVariationSettings: "\\'FILL\\' 1" }}';
    }
    return match;
});

let jsx = `import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="selection:bg-secondary-fixed selection:text-on-secondary-fixed">
` + body + `
    </div>
  );
}
`;

fs.writeFileSync('c:/Users/user/Desktop/truck-parking-ai-main/dashboard/src/pages/Landing.jsx', jsx, 'utf8');
console.log('Done!');
