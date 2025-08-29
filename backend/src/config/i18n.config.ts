import { I18nOptions } from 'nestjs-i18n';
import * as path from 'path';
import { AcceptLanguageResolver, HeaderResolver } from 'nestjs-i18n';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(process.cwd(), 'src/i18n/'),
    watch: true,
  },
  resolvers: [
    new HeaderResolver(['x-custom-lang']),
    {
      use: AcceptLanguageResolver,
      options: {
        matchType: 'loose',
      },
    },
  ],
};
