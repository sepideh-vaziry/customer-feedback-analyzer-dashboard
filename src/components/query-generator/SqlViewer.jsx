import { useState, useMemo } from 'react';
import { Copy, Check, Database } from 'lucide-react';

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL',
  'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR',
  'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'DISTINCT', 'UNION',
  'ALL', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'WITH', 'RECURSIVE', 'CAST', 'COALESCE', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'ASC', 'DESC', 'NATURAL', 'CROSS', 'USING', 'FETCH', 'NEXT', 'ROWS', 'ONLY',
]);

const TOKEN_TYPES = {
  KEYWORD: 'text-primary-600 font-semibold',
  STRING: 'text-success-600',
  NUMBER: 'text-warning-600',
  COMMENT: 'text-text-muted italic',
  IDENT: 'text-text-primary',
  PUNCT: 'text-text-secondary',
  WHITESPACE: '',
};

function tokenizeSql(sql) {
  if (!sql) return [];
  const tokens = [];
  let i = 0;
  const n = sql.length;

  const isIdentStart = (c) => /[A-Za-z_]/.test(c);
  const isIdent = (c) => /[A-Za-z0-9_]/.test(c);
  const isDigit = (c) => /[0-9]/.test(c);

  while (i < n) {
    const c = sql[i];

    if (c === '-' && sql[i + 1] === '-') {
      let j = i + 2;
      while (j < n && sql[j] !== '\n') j++;
      tokens.push({ type: 'COMMENT', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    if (c === '/' && sql[i + 1] === '*') {
      let j = i + 2;
      while (j < n && !(sql[j] === '*' && sql[j + 1] === '/')) j++;
      j = Math.min(n, j + 2);
      tokens.push({ type: 'COMMENT', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    if (c === "'" || c === '"') {
      const quote = c;
      let j = i + 1;
      while (j < n && sql[j] !== quote) {
        if (sql[j] === '\\') j++;
        j++;
      }
      j = Math.min(n, j + 1);
      tokens.push({ type: 'STRING', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    if (isDigit(c)) {
      let j = i;
      while (j < n && (isDigit(sql[j]) || sql[j] === '.')) j++;
      tokens.push({ type: 'NUMBER', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    if (isIdentStart(c)) {
      let j = i;
      while (j < n && isIdent(sql[j])) j++;
      const word = sql.slice(i, j);
      const upper = word.toUpperCase();
      tokens.push({
        type: SQL_KEYWORDS.has(upper) ? 'KEYWORD' : 'IDENT',
        value: word,
      });
      i = j;
      continue;
    }
    if (/\s/.test(c)) {
      let j = i;
      while (j < n && /\s/.test(sql[j])) j++;
      tokens.push({ type: 'WHITESPACE', value: sql.slice(i, j) });
      i = j;
      continue;
    }
    tokens.push({ type: 'PUNCT', value: c });
    i++;
  }
  return tokens;
}

export default function SqlViewer({ sql, databaseType, maxHeight = '400px' }) {
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => tokenizeSql(sql), [sql]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (!sql) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl bg-slate-900 text-slate-500 text-sm">
        Generated SQL will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Database size={12} />
          {databaseType ? databaseType.toLowerCase() : 'sql'}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {copied ? <Check size={12} className="text-success-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="px-4 py-3 overflow-auto text-xs leading-relaxed font-mono text-slate-100"
        style={{ maxHeight }}
      >
        <code>
          {tokens.map((t, idx) => {
            const cls = TOKEN_TYPES[t.type] || '';
            if (!cls) return <span key={idx}>{t.value}</span>;
            return <span key={idx} className={cls}>{t.value}</span>;
          })}
        </code>
      </pre>
    </div>
  );
}
