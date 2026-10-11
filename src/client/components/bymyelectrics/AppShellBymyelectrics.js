import { Account } from '../core/Account.js';
import { newInstance } from '../core/CommonJs.js';
import { Css, darkTheme, ThemeEvents, Themes } from '../core/Css.js';
import { LogIn } from '../core/LogIn.js';
import { LogOut } from '../core/LogOut.js';
import { Modal } from '../core/Modal.js';
import { ShellNavigation } from '../core/ShellNavigation.js';
import { SignUp } from '../core/SignUp.js';
import { htmls } from '../core/VanillaJs.js';
import { getProxyPath } from '../core/Router.js';
import { AppStoreBymyelectrics } from './AppStoreBymyelectrics.js';
import { RouterBymyelectrics, BannerAppTemplate } from './RouterBymyelectrics.js';
import { SettingsBymyelectrics } from './SettingsBymyelectrics.js';
import { Docs } from '../core/Docs.js';
import { Recover } from '../core/Recover.js';
import { DefaultManagement } from '../../services/default/default.management.js';
import { Page500 } from '../core/500.js';
import { Page404 } from '../core/404.js';

class AppShellBymyelectrics {
  static async instance(options = { htmlMainBody: () => html`` }) {
    const RouterInstance = RouterBymyelectrics.instance();
    const user = () => AppStoreBymyelectrics.Data.user.main.model.user;
    const dossierUrl = `${getProxyPath()}docs/Dossier-By-My-Electrics-2025.pdf`;
    const navigation = {
      RouterInstance,
      entries: [
        { id: 'home', route: '', icon: html`<i class="fas fa-home"></i>`, active: true },
        {
          id: 'log-in',
          icon: html`<i class="fas fa-sign-in-alt"></i>`,
          hidden: true,
          view: () => ({ html: async () => await LogIn.instance() }),
        },
        {
          id: 'sign-up',
          icon: html`<i class="fas fa-user-plus"></i>`,
          hidden: true,
          view: () => ({ html: async () => await SignUp.instance({ idModal: 'modal-sign-up' }) }),
        },
        {
          id: 'log-out',
          icon: html`<i class="fas fa-sign-out-alt"></i>`,
          session: true,
          view: () => ({ html: async () => await LogOut.instance() }),
        },
        {
          id: 'account',
          icon: html`<i class="fas fa-user-circle"></i>`,
          session: true,
          view: () => ({
            html: async () => await Account.instance({ idModal: 'modal-account', user: user(), disabled: [] }),
          }),
        },
        {
          id: 'settings',
          icon: html`<i class="fas fa-sliders-h"></i>`,
          view: () => ({ html: async () => await SettingsBymyelectrics.instance({ idModal: 'modal-settings' }) }),
        },
        {
          id: 'docs',
          icon: html`<i class="fas fa-book"></i>`,
          hidden: true,
          view: () => ({
            observer: true,
            // This client publishes no documentation tree, so it offers no guide.
            html: async () => await Docs.instance({ idModal: 'modal-docs', disabled: ['guide'] }),
          }),
        },
        {
          id: 'recover',
          icon: html`<i class="fa-solid fa-arrow-rotate-left"></i>`,
          hidden: true,
          view: () => ({ html: async () => await Recover.instance({ idModal: 'modal-recover', user: user() }) }),
        },
        {
          id: 'default-management',
          icon: html`<i class="fa-solid fa-rectangle-list"></i>`,
          hidden: true,
          view: () => ({ observer: true, html: async () => await DefaultManagement.instance() }),
        },
        {
          id: '404',
          icon: html`<i class="fa-solid fa-triangle-exclamation"></i>`,
          hidden: true,
          view: () => ({ observer: true, html: async () => await Page404.instance({ idModal: 'modal-404' }) }),
        },
        {
          id: '500',
          icon: html`<i class="fa-solid fa-circle-exclamation"></i>`,
          hidden: true,
          view: () => ({ observer: true, html: async () => await Page500.instance({ idModal: 'modal-500' }) }),
        },
        {
          id: 'dossier',
          icon: html`<i class="fa-regular fa-file-lines"></i>`,
          href: dossierUrl,
          action: () => (location.href = dossierUrl),
        },
      ],
    };

    const { barConfig } = await Themes[Css.currentTheme]();
    await Modal.instance({
      id: 'modal-menu',
      html: await ShellNavigation.render(navigation),
      barConfig: newInstance(barConfig),
      slideMenuTopBarBannerFix: async () => {
        return html` <style>
            .bme-bar-logo {
              height: 150px;
              padding-left: 20px;
              top: -25px;
            }
            .slide-menu-top-bar-fix {
              overflow: hidden;
            }
          </style>

          <div class="fl">
            <img
              class="in fll bme-bar-logo ${!darkTheme ? '' : 'negative-color'}"
              src="${getProxyPath()}assets/social.png"
            />
          </div>`;
      },
      title: BannerAppTemplate,
      titleRender: () => {
        ThemeEvents['titleRender'] = () => {
          const srcLogo = `${getProxyPath()}android-chrome-192x192.png`;
          htmls(
            '.action-btn-app-icon-render',
            html`<img class="inl top-bar-app-icon ${!darkTheme ? '' : 'negative-color'}" src="${srcLogo}" />`,
          );
        };
        setTimeout(ThemeEvents['titleRender']);
        return '';
      },
      mode: 'slide-menu',
      shell: { layout: 'standard' },
      RouterInstance,
      htmlMainBody: options?.htmlMainBody ? options.htmlMainBody : undefined,
    });
    ShellNavigation.bind(navigation);
  }
}

export { AppShellBymyelectrics };
