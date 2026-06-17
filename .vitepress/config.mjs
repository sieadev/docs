import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sidebarConfig, pageMetadata } from '../scripts/composer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projects = ['jonion', 'mobot', 'unifi4j'];

function copyContext7Files() {
    const distDir = path.resolve(__dirname, 'dist');

    for (const project of projects) {
        const source = path.resolve(__dirname, `../${project}/context7.json`);
        if (!fs.existsSync(source)) continue;

        const targetDir = path.join(distDir, project);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(source, path.join(targetDir, 'context7.json'));
        console.log(`Copied ${project}/context7.json to dist`);
    }
}

export default {
    title: 'Sieadev Docs',
    description: 'Documentation for all public projects by sieadev.',
    siteTitle: 'Documentation for all public projects by sieadev.',
    ignoreDeadLinks: true,

    head: [
        ['link', { rel: 'icon', href: 'https://static.pixel-services.com/static/assets/pservices_logo.png' }]
    ],

    themeConfig: {
        logo: 'https://static.pixel-services.com/static/assets/pservices_logo.png',
        sidebar: sidebarConfig,
    },

    buildEnd() {
        copyContext7Files();
    },

    transformPageData(pageData) {
        const imageName = `${pageData.relativePath.replace(/\.md$/, '').replace(/\//g, '-')}.png`;
        const localImageUrl = `/assets/banner-cards/${imageName}`;
        const absoluteImageUrl = `https://docs.pixel-services.com/assets/banner-cards/${imageName}`;

        pageData.frontmatter.head ??= [];
        pageData.frontmatter.head.push(
            ['meta', { name: 'twitter:image', content: localImageUrl }],
            ['meta', { name: 'twitter:image:src', content: absoluteImageUrl }],
            ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
            ['meta', { name: 'twitter:image:height', content: "1280" }],
            ['meta', { name: 'twitter:image:width', content: "669" }],
            ['meta', { name: 'twitter:description', content: "" }],
        );
    },
};
