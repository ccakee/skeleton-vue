import * as fs from 'fs/promises';
import vscode from "vscode";
import { Uri } from 'vscode';

const TEMPLATE_REGEX = /<template>([\s\S]*?)<\/template>(?![\s\S]*<\/template>)/i;
const TAG_REGEX = /<([a-zA-Z0-9\-]+)([^>]*)>/g;
const CLASS_REGEX = /class="([^"]*)"/;
const ID_REGEX = /id="([^"]*)"/;
const STYLE_REGEX = /style="([^"]*)"/;

export async function run(uri: Uri) {
    try {
        const data = await fs.readFile(uri.fsPath, 'utf8');
        const templateContent = removeAttributes(data);
        const template = 
`<template>
   ${templateContent}
</template>`;
        const pathName = uri.fsPath.replace(/\\[^\\]*$/, '') + '/' + 'skeleton-vue' + '.vue';
        fs.writeFile(pathName, template).then(() => {
            vscode.window.showInformationMessage(`骨架创建成功`);
        }).catch(() => {
            console.log("创建失败");
        });
    } catch (err) {
        vscode.window.showInformationMessage(`你选错了`);
    }
}

function extractTemplateContent(template: string): string {
    const regex = /{{\s*(.*?)\s*}}/g;
    const replacedTemplate = template.replace(regex, '<span style="background-color: #ff0000;"> - - </span>');
    const matches = replacedTemplate.match(TEMPLATE_REGEX);
    return matches && matches.length > 1 ? matches[1] : "";
}

function removeAttributes(template: string): string {
    const extractedContent = extractTemplateContent(template);
    return extractedContent.replace(TAG_REGEX, (match, tagName, attributes) => {
        let newAttributes = '';
        for (const [attrRegex, attrName] of [[CLASS_REGEX, 'class'], [ID_REGEX, 'id'], [STYLE_REGEX, 'style']]) {
            const attrMatch = attributes.match(attrRegex);
            if (attrMatch) {
                newAttributes += ` ${attrName}="${attrMatch[1]}"`;
            }
        }
        return `<${tagName}${newAttributes}>`;
    });
}

