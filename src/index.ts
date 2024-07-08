import * as fs from 'fs/promises';
import vscode from "vscode";
import { Uri } from 'vscode';

const TEMPLATE_REGEX = /<template>([\s\S]*?)<\/template>(?![\s\S]*<\/template>)/i;

export async function run(uri: Uri) {
    console.log(uri, 11111111);

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
    const replacedTemplate = template.replace(regex, '<span style="background-color: #efefef;"> - - </span>');
    const matches = replacedTemplate.match(TEMPLATE_REGEX);
    return matches && matches.length > 1 ? matches[1] : "";
}

function removeAttributes(template: string): string {
    const extractedContent = extractTemplateContent(template);
    // 移除 Vue 指令（如 v-if, v-for 等）  
    function removeVueDirectives(str: string): string {
        return str.replace(/v-[\w-]+="[^"]*"/g, '')
            .replace(/v-[\w-]+='[^']*'/g, '')
            .replace(/v-[\w-]+/g, '');
    }

    // 移除 Vue 动态属性（如 :class, :style, :xx 等）  
    function removeVueDynamicAttrs(str: string): string {
        return str.replace(/:[\w-]+="[^"]*"/g, '')
            .replace(/:[\w-]+='[^']*'/g, '')
            .replace(/@[\w-]+="[^"]*"/g, '')
            .replace(/@[\w-]+='[^']*'/g, '');
    }

    let result = removeVueDirectives(extractedContent);

    result = removeVueDynamicAttrs(result);

    return result;
}

