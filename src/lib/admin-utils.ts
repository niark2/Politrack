import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function verifyToken(token: string | null) {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) return false;
    return token === adminToken;
}

export async function listAllFiles(dir: string = DATA_DIR): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return listAllFiles(res);
        } else {
            return res.replace(DATA_DIR + path.sep, '');
        }
    }));
    return files.flat();
}

export async function readFile(relativePath: string) {
    const fullPath = path.resolve(DATA_DIR, relativePath);
    const resolvedDataDir = path.resolve(DATA_DIR) + path.sep;
    if (!fullPath.startsWith(resolvedDataDir)) {
        throw new Error('Access denied');
    }
    return await fs.readFile(fullPath, 'utf8');
}

export async function writeFile(relativePath: string, content: string) {
    const fullPath = path.resolve(DATA_DIR, relativePath);
    const resolvedDataDir = path.resolve(DATA_DIR) + path.sep;
    if (!fullPath.startsWith(resolvedDataDir)) {
        throw new Error('Access denied');
    }

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf8');
}
