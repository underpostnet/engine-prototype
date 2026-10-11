import { Account } from '../core/Account.js';
import { newInstance } from '../core/CommonJs.js';
import { Css, darkTheme, ThemeEvents, Themes } from '../core/Css.js';
import { LogIn } from '../core/LogIn.js';
import { LogOut } from '../core/LogOut.js';
import { Modal } from '../core/Modal.js';
import { ShellNavigation } from '../core/ShellNavigation.js';
import { SignUp } from '../core/SignUp.js';
import { htmls, s } from '../core/VanillaJs.js';
import { getProxyPath, getPublicRouteParam } from '../core/Router.js';
import { AppStoreCecinasmarcelina } from './AppStoreCecinasmarcelina.js';
import { RouterCecinasmarcelina, BannerAppTemplate } from './RouterCecinasmarcelina.js';
import { SettingsCecinasmarcelina } from './SettingsCecinasmarcelina.js';
import { Badge } from '../core/Badge.js';
import { Recover } from '../core/Recover.js';
import { Page500 } from '../core/500.js';
import { Page404 } from '../core/404.js';
import { PanelForm } from '../core/PanelForm.js';
import { Chat } from '../core/Chat.js';
import { PublicProfile } from '../core/PublicProfile.js';

class AppShellCecinasmarcelina {
  static async instance(options = { htmlMainBody: () => html`` }) {
    const RouterInstance = RouterCecinasmarcelina.instance();
    const user = () => AppStoreCecinasmarcelina.Data.user.main.model.user;
    const navigation = {
      RouterInstance,
      entries: [
        { id: 'home', route: '', icon: html`<i class="fas fa-home"></i>`, active: true },
        {
          id: 'log-in',
          icon: html`<i class="fas fa-sign-in-alt"></i>`,
          view: () => ({ html: async () => await LogIn.instance() }),
        },
        {
          id: 'sign-up',
          icon: html`<i class="fas fa-user-plus"></i>`,
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
          id: 'public-profile',
          route: 'u',
          icon: html`<i class="fas fa-user-tag"></i>`,
          session: true,
          action: async (e, open) => {
            const idModal = 'modal-public-profile';
            // `/u/:username`, or the signed-in user's own profile on a bare `/u`
            const username = getPublicRouteParam('profile') || user().username;
            if (s(`.${idModal}`) && username && username !== PublicProfile.currentUsername)
              return await PublicProfile.Update({ idModal, user: { username } });
            return await open({
              title: '',
              observer: true,
              html: async () => await PublicProfile.instance({ idModal, user: { username } }),
            });
          },
        },
        {
          id: 'settings',
          icon: html`<i class="fas fa-sliders-h"></i>`,
          view: () => ({
            html: async () => await SettingsCecinasmarcelina.instance({ idModal: 'modal-settings' }),
          }),
        },
        {
          id: 'recover',
          icon: html`<i class="fa-solid fa-arrow-rotate-left"></i>`,
          hidden: true,
          view: () => ({ html: async () => await Recover.instance({ idModal: 'modal-recover', user: user() }) }),
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
          id: 'blog',
          icon: html`<i class="fa-solid fa-file-invoice"></i>`,
          view: () => ({
            publicRoute: 'entry',
            observer: true,
            html: async () => {
              setTimeout(async () => {
                await PanelForm.instance({
                  idPanel: 'cecinasmarcelina-blog',
                  cecinasmarcelinaUrlImage: `${getProxyPath()}android-chrome-96x96.png`,
                  appStore: AppStoreCecinasmarcelina,
                  parentIdModal: 'modal-blog',
                  scrollClassContainer: `html-modal-blog`,
                  route: 'blog',
                  entryHost: true,
                });
              });
            },
          }),
        },
        {
          id: 'chat',
          icon: html`<i class="far fa-comments"></i>`,
          badge: await Badge.instance({ id: 'main-btn-chat', type: 'circle-red', classList: 'hide badge-notification-menu' }),
          view: () => ({ observer: true, html: async () => await Chat.instance({ idModal: 'modal-chat' }) }),
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
            .cm-bar-logo {
              height: 150px;
              padding-left: 20px;
              top: -25px;
            }
            .slide-menu-top-bar-fix {
              overflow: hidden;
            }
          </style>

          <div class="fl">
            <img class="in fll cm-bar-logo" src="${getProxyPath()}android-chrome-256x256.png" />
          </div>`;
      },
      title: BannerAppTemplate,
      titleRender: () => {
        ThemeEvents['titleRender'] = () => {
          const srcLogo = `${getProxyPath()}android-chrome-256x256.png`;

          htmls('.action-btn-app-icon-render', html`<img class="inl top-bar-app-icon" src="${srcLogo}" />`);
        };
        setTimeout(ThemeEvents['titleRender']);
        return '';
      },
      mode: 'slide-menu',
      shell: { layout: 'standard' },
      RouterInstance,
      htmlMainBody: options.htmlMainBody,
    });
    ShellNavigation.bind(navigation);

    ThemeEvents['main-theme-handler'] = () => {
      if (s(`.style-ssr-background-image`)) {
        if (darkTheme) {
          htmls(
            `.style-ssr-background-image`,
            css`
              .ssr-background-image {
                background: #1a0a0a;
              }
            `,
          );
        } else {
          htmls(
            `.style-ssr-background-image`,
            css`
              .ssr-background-image {
                background: #faeee6;
              }
            `,
          );
        }
      }
      if (s(`.style-lading-render`))
        htmls(
          `.style-lading-render`,
          html` <style>
            .landing-page {
              font-family:
                'Segoe UI',
                system-ui,
                -apple-system,
                sans-serif;
              line-height: 1.6;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
              color: ${darkTheme ? '#f5ddd0' : '#3d1111'};
            }

            /* Hero - full viewport cover */
            .hero-section {
              position: relative;
              text-align: center;
              padding: 0;
              margin: 0 calc(-50vw + 50%);
              width: 100vw;
              min-height: calc(100vh - 50px);
              display: flex;
              align-items: center;
              justify-content: center;
              background-image: url('${getProxyPath()}assets/background/hero.webp');
              background-size: cover;
              background-position: center;
              overflow: visible;
            }
            .hero-overlay {
              position: absolute;
              inset: 0;
              background: ${darkTheme
              ? 'linear-gradient(180deg, rgba(26,10,10,0.85) 0%, rgba(61,17,17,0.75) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(245,221,208,0.82) 100%)'};
            }
            .hero-inner {
              position: relative;
              z-index: 1;
              padding: 4rem 2rem;
              max-width: 700px;
            }
            .hero-logo {
              width: 330px;
              height: auto;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 1.5rem;
              box-shadow: 0 4px 20px ${darkTheme ? 'rgba(0,0,0,0.5)' : 'rgba(139,69,19,0.25)'};
              ${darkTheme ? 'filter: brightness(1.1);' : ''}
            }
            .hero-title {
              font-size: 2.6rem;
              margin-bottom: 0.75rem;
              line-height: 1.2;
              background: linear-gradient(
                135deg,
                ${darkTheme ? '#c0392b' : '#8b4513'},
                ${darkTheme ? '#e74c3c' : '#a0522d'}
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .hero-subtitle {
              font-size: 1.2rem;
              font-weight: 600;
              color: ${darkTheme ? '#e8a87c' : '#8b4513'};
              margin-bottom: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .hero-description {
              font-size: 1.05rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              margin-bottom: 2rem;
              font-style: italic;
            }
            .hero-cta {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 1.5rem;
            }
            .btn {
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 1rem;
            }
            .btn:hover {
              transform: translateY(-2px);
            }
            .btn-primary {
              background: ${darkTheme ? '#8b0000' : '#8b4513'};
              color: #fff;
              border: 2px solid ${darkTheme ? '#8b0000' : '#8b4513'};
            }
            .btn-primary:hover {
              background: ${darkTheme ? '#a02020' : '#a0522d'};
              border-color: ${darkTheme ? '#a02020' : '#a0522d'};
              color: #fff;
            }
            .btn-outline {
              background: transparent;
              color: ${darkTheme ? '#c0392b' : '#8b4513'};
              border: 2px solid ${darkTheme ? '#c0392b' : '#8b4513'};
            }
            .btn-outline:hover {
              background: ${darkTheme ? '#c0392b' : '#8b4513'};
              color: #fff;
            }

            /* Section lead */
            .section-lead {
              font-size: 1.05rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              max-width: 650px;
              margin: -1.5rem auto 2.5rem;
              font-style: italic;
            }

            /* Products */
            .products-section {
              padding: 4rem 1rem;
              text-align: center;
            }
            .products-section h2,
            .pillars-section h2,
            .about-section h2 {
              font-size: 2rem;
              margin-bottom: 2.5rem;
              color: ${darkTheme ? '#e74c3c' : '#8b4513'};
            }
            .products-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 1.5rem;
            }
            .product-card {
              background: ${darkTheme ? 'rgba(61, 17, 17, 0.5)' : '#fff'};
              padding: 2rem 1.5rem;
              border-radius: 12px;
              box-shadow: 0 4px 15px ${darkTheme ? 'rgba(0,0,0,0.3)' : 'rgba(139,69,19,0.1)'};
              transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
            }
            .product-card:hover {
              box-shadow: 0 10px 30px ${darkTheme ? 'rgba(0,0,0,0.4)' : 'rgba(139,69,19,0.2)'};
            }
            .product-icon {
              font-size: 2.5rem;
              margin-bottom: 0.75rem;
            }
            .product-card h3 {
              font-size: 1.15rem;
              margin-bottom: 0.5rem;
              color: ${darkTheme ? '#f5ddd0' : '#3d1111'};
            }
            .product-card p {
              font-size: 0.95rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              line-height: 1.5;
            }

            /* About */
            .about-section {
              padding: 4rem 2rem;
              text-align: center;
              background: ${darkTheme ? 'rgba(61, 17, 17, 0.3)' : 'rgba(245, 221, 208, 0.35)'};
              border-radius: 16px;
              margin: 2rem 0;
            }
            .about-tagline {
              font-size: 1.2rem;
              font-weight: 600;
              color: ${darkTheme ? '#e8a87c' : '#8b4513'};
              margin-bottom: 1.5rem;
            }
            .about-content p {
              font-size: 1rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              max-width: 750px;
              margin: 0 auto 1rem;
              line-height: 1.7;
            }

            /* Pillars */
            .pillars-section {
              padding: 4rem 1rem;
              text-align: center;
            }
            .pillars-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1.5rem;
            }
            .pillar-card {
              background: ${darkTheme ? 'rgba(61, 17, 17, 0.5)' : '#fff'};
              padding: 2rem 1.5rem;
              border-radius: 12px;
              box-shadow: 0 4px 15px ${darkTheme ? 'rgba(0,0,0,0.3)' : 'rgba(139,69,19,0.1)'};
              transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
            }
            .pillar-card:hover {
              box-shadow: 0 10px 30px ${darkTheme ? 'rgba(0,0,0,0.4)' : 'rgba(139,69,19,0.2)'};
            }
            .pillar-icon {
              font-size: 2.5rem;
              margin-bottom: 0.75rem;
            }
            .pillar-card h3 {
              font-size: 1.15rem;
              margin-bottom: 0.5rem;
              color: ${darkTheme ? '#f5ddd0' : '#3d1111'};
            }
            .pillar-card p {
              font-size: 0.95rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              line-height: 1.5;
            }

            /* Location */
            .location-section {
              padding: 4rem 1rem;
              text-align: center;
              background: ${darkTheme ? 'rgba(61, 17, 17, 0.3)' : 'rgba(245, 221, 208, 0.4)'};
              border-radius: 16px;
              margin: 2rem 0;
            }
            .location-section h2 {
              font-size: 2rem;
              color: ${darkTheme ? '#e74c3c' : '#8b4513'};
              margin-bottom: 0.5rem;
            }
            .location-tagline {
              font-size: 1.15rem;
              font-weight: 600;
              color: ${darkTheme ? '#e8a87c' : '#8b4513'};
              margin-bottom: 1rem;
              font-style: italic;
            }
            .location-description {
              font-size: 1.05rem;
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              max-width: 700px;
              margin: 0 auto;
            }

            /* Contact */
            .contact-section {
              padding: 3rem 1rem;
              text-align: left;
            }
            .contact-section h2 {
              font-size: 1.6rem;
              color: ${darkTheme ? '#e74c3c' : '#8b4513'};
              margin-bottom: 1.5rem;
            }
            .contact-info {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }
            .contact-item {
              display: flex;
              align-items: center;
              gap: 0.6rem;
              font-size: 0.95rem;
              color: ${darkTheme ? '#f5ddd0' : '#3d1111'};
              border-radius: 10px;
              transition: background 0.3s ease, transform 0.2s ease;
            }
            .contact-item:hover {
              transform: translateY(-2px);
            }
            .contact-item i {
              color: ${darkTheme ? '#c0392b' : '#8b4513'};
              font-size: 1.3rem;
              width: 24px;
              text-align: center;
              flex-shrink: 0;
            }
            .contact-item a {
              color: ${darkTheme ? '#e8a87c' : '#8b4513'};
              text-decoration: none;
              transition: color 0.2s ease;
            }
            .contact-item a:hover {
              color: ${darkTheme ? '#f5ddd0' : '#c0392b'};
            }

            /* Footer */
            .landing-footer {
              padding: 2rem 1rem;
              margin-top: 4rem;
              text-align: center;
              border-top: 1px solid ${darkTheme ? 'rgba(139,0,0,0.3)' : 'rgba(139,69,19,0.2)'};
              color: ${darkTheme ? '#c4a08a' : '#6b4423'};
              font-size: 0.9rem;
            }

            @media (max-width: 767px) {
              .hero-title {
                font-size: 2rem;
              }
              .hero-inner {
                padding: 2rem 1rem;
              }
              .hero-logo {
                width: 180px;
              }
              .hero-cta {
                flex-direction: column;
                align-items: center;
                gap: 0.6rem;
                margin-top: 1rem;
              }
              .btn {
                padding: 0.6rem 1.2rem;
                font-size: 0.9rem;
                width: 100%;
                max-width: 220px;
                text-align: center;
              }
              .products-grid,
              .pillars-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>`,
        );
    };

    setTimeout(ThemeEvents['main-theme-handler']);
  }
}

export { AppShellCecinasmarcelina };
