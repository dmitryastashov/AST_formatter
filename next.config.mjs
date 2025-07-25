/** @type {import('next').NextConfig} */
const nextConfig = {
  // Эта опция указывает Next.js создавать статический сайт,
  // который можно загрузить на любой хостинг.
  output: 'export',

  // Отключаем оптимизацию шрифтов.
  // Это решает проблему "зависания" сборки на компьютерах,
  // где есть проблемы с доступом к серверам Google Fonts.
  // На внешний вид сайта это не влияет.
  optimizeFonts: false,
};

export default nextConfig;
