'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Check,
  Code,
  Copy,
  Download,
  Moon,
  Sun,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { beautifyCode } from '@/lib/beautify';
import { exportToTxt } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


type Language = 'javascript' | 'java' | 'sql' | 'html' | 'css';

const initialCodes: Record<Language, string> = {
  javascript:
    "function hello(){console.log('Привет, Мир!'); if(true) {return 1}}",
  css: 'body{color:red; font-size:12px;} .container{border:1px solid #ccc;padding:10px;}',
  html: '<html><head><title>Моя страница</title></head><body><h1>Добро пожаловать</h1><p>Это параграф.</p><div>Еще один div</div></body></html>',
  sql: "SELECT id, name, age FROM users WHERE status='active' AND age > 21 ORDER BY name ASC;",
  java: 'public class HelloWorld { public static void main(String[] args) { System.out.println("Привет, мир!"); for(int i=0;i<5;i++){System.out.println(i);} } }',
};

export function CodeSnapshot() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [inputCode, setInputCode] = useState(initialCodes.javascript);
  const [outputCode, setOutputCode] = useState('');
  const [theme, setTheme] = useState('light');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('codesnapshot-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
    // Set initial formatted code on mount
    handleBeautify(initialCodes.javascript, 'javascript');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('codesnapshot-theme', theme);
  }, [theme]);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    const newCode = initialCodes[value];
    setInputCode(newCode);
    handleBeautify(newCode, value);
  };

  const handleBeautify = (codeToFormat = inputCode, lang = language) => {
    try {
      const formatted = beautifyCode(codeToFormat, lang);
      setOutputCode(formatted);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка форматирования',
        description: 'Не удалось украсить код. Пожалуйста, проверьте синтаксические ошибки.',
      });
    }
  };

  const handleClear = () => {
    setInputCode('');
    setOutputCode('');
  };

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Card className="w-full max-w-5xl shadow-2xl">
      <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
           <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Code className="h-6 w-6 text-primary-foreground" />
           </div>
          <div>
            <CardTitle className="font-headline">formatter.astashov.space</CardTitle>
            <CardDescription>
              Украшайте, форматируйте и делитесь своим кодом.
            </CardDescription>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full sm:w-[150px]" aria-label="Выберите язык">
              <SelectValue placeholder="Язык" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Переключить тему">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="input-code">Ваш код</Label>
            <Textarea
              id="input-code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Вставьте ваш неформатированный код сюда..."
              className="h-80 resize-none font-code text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="output-code">Отформатированный код</Label>
             <div ref={outputRef} id="output-code" className="h-80 overflow-auto rounded-md border bg-muted/50">
                {outputCode ? (
                  <SyntaxHighlighter
                    language={language}
                    style={theme === 'dark' ? oneDark : oneLight}
                    customStyle={{
                      background: 'transparent',
                      margin: 0,
                      padding: '1rem',
                      height: '100%',
                      fontFamily: 'var(--font-source-code-pro)',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'inherit',
                      },
                    }}
                    showLineNumbers={false}
                    wrapLines={true}
                  >
                    {outputCode}
                  </SyntaxHighlighter>
                ) : (
                  <div className="flex h-full items-center justify-center p-4">
                    <span className="font-code text-sm text-muted-foreground">
                      Нажмите "Украсить", чтобы увидеть результат...
                    </span>
                  </div>
                )}
             </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4">
            <Button onClick={() => handleBeautify()}>
              <WandSparkles className="mr-2 h-4 w-4" />
              Украсить
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={handleCopy} disabled={!outputCode}>
          {isCopied ? (
            <Check className="mr-2 h-4 w-4 text-accent" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {isCopied ? 'Скопировано!' : 'Копировать'}
        </Button>
        <Button variant="outline" onClick={() => exportToTxt(outputCode, language)} disabled={!outputCode}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт в TXT
        </Button>
      </CardFooter>
    </Card>
  );
}
