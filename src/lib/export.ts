'use client';

import { toast } from "@/hooks/use-toast";

export const exportToTxt = (code: string, language: string) => {
  if (!code) {
    toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Нет кода для экспорта.",
    });
    return;
  }
  
  try {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `formatter.astashov.space-${language}.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Не удалось экспортировать в TXT!', err);
    toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании TXT файла.",
    });
  }
};
