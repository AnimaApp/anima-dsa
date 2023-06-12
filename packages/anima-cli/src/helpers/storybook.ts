import fs from 'fs';
import path from 'path';
import { isDebug } from './debug';
import { API_URL } from '../constants/api';

const JS_EXTENSIONS = ["js", "jsx", "ts", "tsx", "vue"];

export const getJSFiles = (folder: string) => {
    const JSFiles: string[] = [];

    for (const item of fs.readdirSync(folder)) {
        const fullPath = path.join(folder, item);
        if (fs.lstatSync(fullPath).isDirectory()) {
            JSFiles.push(...getJSFiles(fullPath));
        } else {
            const extension = item.split(".").pop()
            if (extension && JS_EXTENSIONS.includes(extension) && item.charAt(0) === item.charAt(0).toUpperCase()) {
                JSFiles.push(fullPath);
            }
        }
    }

    return JSFiles;
};

export const generateStorybookConfig = async (file: string, token: string) => {
    const res = await fetch(`${API_URL}/rpc/generate_storybook`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ code: file }),
    });

    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else if (isDebug()){
        console.log('response status =>', res.status);
        console.log('response data =>', await res.text());
    }

    return null;
};
