const fs = require('fs');
const path = require('path');

const pages = [
    'src/app/admin/questions/page.tsx',
    'src/app/admin/summaries/page.tsx',
    'src/app/admin/categories/page.tsx'
];

pages.forEach(pagePath => {
    if (!fs.existsSync(pagePath)) {
        console.log(`Skipping ${pagePath} - file not found`);
        return;
    }

    let content = fs.readFileSync(pagePath, 'utf8');

    // Check if it uses useSearchParams
    if (!content.includes('useSearchParams')) {
        console.log(`Skipping ${pagePath} - doesn't use useSearchParams`);
        return;
    }

    // Check if already has Suspense
    if (content.includes('Suspense')) {
        console.log(`Skipping ${pagePath} - already has Suspense`);
        return;
    }

    console.log(`Fixing ${pagePath}...`);

    // Add Suspense import
    content = content.replace(
        'import { useEffect, useState } from "react";',
        'import { useEffect, useState, Suspense } from "react";'
    );

    // Find the main export function
    const functionMatch = content.match(/export default function (\w+)\(\)/);
    if (!functionMatch) {
        console.log(`Could not find main function in ${pagePath}`);
        return;
    }

    const functionName = functionMatch[1];
    const contentFunctionName = functionName.replace('Page', 'Content');

    // Replace function signature and wrap with Suspense
    const oldFunction = `export default function ${functionName}() {
    const router = useRouter();
    const searchParams = useSearchParams();`;

    const newFunction = `export default function ${functionName}() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <${contentFunctionName} />
        </Suspense>
    );
}

function ${contentFunctionName}() {
    const router = useRouter();
    const searchParams = useSearchParams();`;

    content = content.replace(oldFunction, newFunction);

    fs.writeFileSync(pagePath, content);
    console.log(`Fixed ${pagePath}`);
});

console.log('Done!');
