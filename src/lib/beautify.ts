type Language = 'javascript' | 'java' | 'sql' | 'html' | 'css';

const formatBraces = (code: string): string => {
    let indentLevel = 0;
    const indentSize = 2;
    let formattedCode = '';
    const lines = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/;\s*/g, ';\n')
        .replace(/}\s*/g, '}\n')
        .replace(/\n\s*}/g, '\n}')
        .split('\n');

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        formattedCode += ' '.repeat(indentLevel * indentSize) + trimmed + '\n';

        if (trimmed.endsWith('{')) {
            indentLevel++;
        }
    });
    return formattedCode.replace(/\n\s*\n/g, '\n').trim();
};

const formatHtml = (code: string): string => {
    let indentLevel = 0;
    const indentSize = 2;
    let formattedCode = '';
    const lines = code.replace(/>\s*</g, '>\n<').split('\n');

    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        const isDoctype = trimmed.toLowerCase().startsWith('<!doctype');

        if (trimmed.startsWith('</') && !isDoctype) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        formattedCode += ' '.repeat(indentLevel * indentSize) + trimmed + '\n';

        const tagNameMatch = trimmed.match(/^<([a-zA-Z0-9]+)/);
        const tagName = tagNameMatch ? tagNameMatch[1] : null;

        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !isDoctype && tagName && !selfClosingTags.includes(tagName) && !trimmed.endsWith('/>')) {
            indentLevel++;
        }
    });

    return formattedCode.trim();
};

const formatSql = (code: string): string => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'AND', 'OR', 'NOT', 'AS'];
    let formatted = code;
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw.replace(' ', '\\s')}\\b`, 'gi');
        formatted = formatted.replace(regex, kw.toUpperCase());
    });
    return formatted
        .replace(/;\s*/g, ';\n')
        .replace(/\s+(FROM|WHERE|JOIN|GROUP BY|ORDER BY)\s+/g, '\n$1 ')
        .trim();
};


export const beautifyCode = (code: string, language: Language): string => {
    switch (language) {
        case 'javascript':
        case 'java':
        case 'css':
            return formatBraces(code);
        case 'html':
            return formatHtml(code);
        case 'sql':
            return formatSql(code);
        default:
            return code;
    }
};
