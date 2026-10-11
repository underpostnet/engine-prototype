import { Account } from '../core/Account.js';
import { BtnIcon } from '../core/BtnIcon.js';
import { commonModeratorGuard, newInstance, range } from '../core/CommonJs.js';
import { Css, ThemeEvents, Themes, darkTheme } from '../core/Css.js';
import { EventsUI } from '../core/EventsUI.js';
import { LogIn } from '../core/LogIn.js';
import { LogOut } from '../core/LogOut.js';
import { Modal, renderViewTitle } from '../core/Modal.js';
import { ShellLayout } from '../core/ShellLayout.js';
import { ShellNavigation } from '../core/ShellNavigation.js';
import { SignUp } from '../core/SignUp.js';
import { Translate } from '../core/Translate.js';
import { htmls, prepend, s } from '../core/VanillaJs.js';
import { AppStoreHealthcare } from './AppStoreHealthcare.js';
import { RouterHealthcare, BannerAppTemplate } from './RouterHealthcare.js';
import { SettingsHealthcare } from './SettingsHealthcare.js';
import { Recover } from '../core/Recover.js';
import { MenuHomeHealthcare, NutritionalTips } from './CommonHealthcare.js';
import { CalendarCore } from '../core/CalendarCore.js';
import { AppointmentFormHealthCare } from './AppointmentFormHealthCare.js';
import { HealthcareAppointmentService } from '../../services/healthcare-appointment/healthcare-appointment.service.js';
import { HealthcareAppointmentManagement } from '../../services/healthcare-appointment/healthcare-appointment.management.js';
import { RecordMoodHealthcare } from './RecordMoodHealthcare.js';
import { getProxyPath, getQueryParams } from '../core/Router.js';

const homeIcon = (routeId) => html`<img class="slide-menu-icon" src="${getProxyPath()}${MenuHomeHealthcare[routeId].icon}" />`;

const homeIconText = (routeId) => html`<span class="inl menu-label-text-slide-menu-icon">${Translate.instance(routeId)}</span>`;

class AppShellHealthcare {
  static async instance() {
    const RouterInstance = RouterHealthcare.instance();
    const user = () => AppStoreHealthcare.Data.user.main.model.user;

    const appoimentFormRender = async (eventData) => {
      const { barConfig } = await Themes[Css.currentTheme]();
      const idModal = `modal-healthcare-appointment${eventData ? `-${new Date(eventData.start).getTime()}` : ''}`;
      await Modal.instance({
        id: idModal,
        route: 'healthcare-appointment',
        barConfig,
        title: renderViewTitle({
          icon: html` <i class="fas fa-medkit"></i>`,
          text: `${eventData ? `${eventData.event.title} ` : ''}${Translate.instance('healthcare-appointment')}`,
        }),
        html: async () =>
          await AppointmentFormHealthCare.instance({ idModal: 'modal-healthcare-appointment' }, eventData),
        handleType: 'bar',
        maximize: true,
        mode: 'view',
        slideMenu: 'modal-menu',
        RouterInstance,
      });
      if (!eventData) return { status: 'error' };
      const cleanEvent = () => {
        AppointmentFormHealthCare.offSubmitted(idModal);
        delete Modal.Data[idModal].onCloseListener[idModal];
      };
      return await new Promise((resolve) => {
        AppointmentFormHealthCare.onSubmitted(
          async ({ status, data, message }) => {
            cleanEvent();
            await Modal.removeModal(idModal);
            return resolve({ status });
          },
          { key: idModal },
        );
        Modal.Data[idModal].onCloseListener[idModal] = () => {
          cleanEvent();
          return resolve({ status: 'error' });
        };
      });
    };

    const navigation = {
      RouterInstance,
      entries: [
        {
          id: 'settings',
          icon: html`<i class="fas fa-sliders-h"></i>`,
          view: () => ({ html: async () => await SettingsHealthcare.instance({ idModal: 'modal-settings' }) }),
        },
        { id: 'home', route: '', icon: html`<i class="fas fa-home"></i>`, active: true },
        {
          id: 'log-in',
          icon: html`<i class="fas fa-sign-in-alt"></i>`,
          view: () => ({ html: async () => await LogIn.instance() }),
        },
        {
          id: 'sign-up',
          icon: html`<i class="fas fa-user-plus"></i>`,
          view: () => ({
            html: async () =>
              await SignUp.instance({
                idModal: 'modal-sign-up',
                bottomRender: async () => html` <div class="in section-mp"></div>`,
              }),
          }),
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
          id: 'recover',
          icon: html`<i class="fa-solid fa-arrow-rotate-left"></i>`,
          hidden: true,
          view: () => ({ html: async () => await Recover.instance({ idModal: 'modal-recover', user: user() }) }),
        },
        {
          id: 'nutrition-tips',
          icon: homeIcon('nutrition-tips'),
          text: homeIconText('nutrition-tips'),
          hidden: true,
          view: () => ({
            html: async () => {
              let render = '';

              for (const indexTip of range(0, NutritionalTips.length - 1)) {
                render += html`<div class="in nutrition-tips-panel-container">
                  <div class="in b0-panel-sub-container">
                    <div class="fl">
                      <div class="in fll" style="width: 30%;">
                        <div class="in nutrition-tips-panel-cell">
                          <div class="abs center">
                            <img
                              class="in nutrition-tips-panel-icon"
                              src="${getProxyPath()}${NutritionalTips[indexTip].icon}"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="in fll" style="width: 70%;">
                        <div class="in nutrition-tips-panel-cell">
                          <br />${Translate.instance(`nutrition-tips-${indexTip}`)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
              }
              return html`${render}`;
            },
          }),
        },
        {
          id: 'record-mood',
          icon: homeIcon('record-mood'),
          text: homeIconText('record-mood'),
          hidden: true,
          view: async () => ({
            observer: true,
            html: await RecordMoodHealthcare.instance({ idModal: 'modal-record-mood' }),
          }),
        },
        {
          id: 'calendar',
          icon: html`<i class="fas fa-calendar-alt"></i>`,
          text: Translate.instance('healthcare-appointment'),
          view: async () => {
            const idModal = 'modal-calendar';
            const route = 'calendar';
            const { data: hiddenDates } = await HealthcareAppointmentService.get({ id: 'appointment-dates' });
            return {
              observer: true,
              html: async () => {
                setTimeout(() => {
                  Modal.Data['modal-calendar'].onCloseListener['TopRefreshEvent'] = () => {
                    LogIn.offLogin('model-appointment-calendar');
                    LogOut.offLogout('model-appointment-calendar');
                  };
                  const authSwitch = () => {
                    if (!s(`.btn-calendar-panel-${idModal}-add`)) return;
                    if (commonModeratorGuard(AppStoreHealthcare.Data.user.main.model.user.role))
                      s(`.btn-calendar-panel-${idModal}-add`).classList.remove('hide');
                    else {
                      s(`.btn-calendar-panel-${idModal}-add`).classList.add('hide');
                    }
                  };
                  LogIn.onLogin(authSwitch, { key: 'model-appointment-calendar' });
                  LogOut.onLogout(authSwitch, { key: 'model-appointment-calendar' });
                  setTimeout(() => {
                    ShellLayout.hideChrome();

                    setTimeout(() => {
                      s(`.btn-calendar-panel-modal-calendar-custom0`).click();
                    }, 500);
                    setTimeout(() => {
                      s(`.btn-calendar-panel-modal-calendar-custom0`).click();
                    }, 1500);
                  });
                });
                return await CalendarCore.instance({
                  idModal,
                  appStore: AppStoreHealthcare,
                  route,
                  hiddenDates,
                  parentIdModal: 'modal-calendar',
                  role: {
                    add: () => commonModeratorGuard(AppStoreHealthcare.Data.user.main.model.user.role),
                  },
                  eventClick: async function (dateData, args) {
                    const { status } = await appoimentFormRender(dateData);
                    if (status === 'success') {
                      CalendarCore.Data[idModal].hiddenDates.push(dateData.start);
                      args.el.remove();
                    }
                  },
                });
              },
            };
          },
        },
        {
          id: 'healthcare-appointment',
          icon: html`<i class="fas fa-medkit"></i>`,
          hidden: true,
          action: () => s(`.main-btn-calendar`).click(),
        },
        {
          id: 'healthcare-appointment-management',
          icon: html`<i class="fa-solid fa-rectangle-list"></i>`,
          hidden: true,
          view: () => ({
            html: async () => await HealthcareAppointmentManagement.instance({ appStore: AppStoreHealthcare }),
          }),
        },
      ],
    };

    const { barConfig } = await Themes[Css.currentTheme]();

    const vitaintegralMod = location.host.match('vitaintegral') || getQueryParams().vitaintegral;
    await Modal.instance({
      id: 'modal-menu',
      html: await ShellNavigation.render(navigation),
      barConfig: newInstance(barConfig),
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
      slideMenuTopBarBannerFix: async () => {
        return html` <style>
            .healthcare-bar-logo {
              height: 200px;
              top: -50px;
            }
            .vitaintegral-bar-logo {
              height: 85px;
              top: 8px;
              left: 14px;
            }
            .slide-menu-top-bar-fix {
              overflow: hidden;
            }
          </style>

          <img
            class="in ${vitaintegralMod ? `vitaintegral-bar-logo` : `healthcare-bar-logo`}"
            src="${getProxyPath()}assets/${vitaintegralMod ? `vitaintegral/logo.png` : `icons/23.png`}"
          />`;
      },
      mode: 'slide-menu',
      shell: { layout: 'standard' },
      RouterInstance,
      htmlMainBody: async () => {
        setTimeout(() => {
          Modal.Data['main-body'].onObserverListener['observer'] = () => {
            if (s(`.main-body`).offsetWidth < 170 * 4) {
              htmls(
                `.style-home-menu-container`,
                html` <style>
                  .home-menu-container {
                    width: ${170 * 2}px;
                  }
                </style>`,
              );

              return;
            }
            htmls(
              `.style-home-menu-container`,
              html` <style>
                .home-menu-container {
                  width: ${170 * 4}px;
                }
              </style>`,
            );
          };
          EventsUI.onClick(`.home-body-btn-${'nutrition-tips'}`, () => {
            s(`.main-btn-${'nutrition-tips'}`).click();
          });
          EventsUI.onClick(`.home-body-btn-${'record-mood'}`, () => {
            s(`.main-btn-${'record-mood'}`).click();
          });
          ThemeEvents['banner'] = () => {
            setTimeout(() => {
              if (darkTheme) {
                s(`.healthcare-banner`).classList.add('negative-color');
                s(`.healthcare-bar-logo`).classList.add('negative-color');
              } else {
                s(`.healthcare-banner`).classList.remove('negative-color');
                s(`.healthcare-bar-logo`).classList.remove('negative-color');
              }
            });
          };
          ThemeEvents['banner']();
        });
        if (vitaintegralMod) {
          s(`link[rel='icon']`).remove();
          // setAttribute('href', `${getProxyPath()}assets/vitaintegral/favicon.png`);
          prepend('head', html`<link rel="icon" type="image/x-icon" href="/assets/vitaintegral/favicon.png" />`);
        }
        let render = '';
        for (const routeId of Object.keys(MenuHomeHealthcare)) {
          if (vitaintegralMod && routeId === 'size-baby') continue;
          const { icon } = MenuHomeHealthcare[routeId];
          render += html`${await BtnIcon.instance({
            label: html`<div class="abs center" style="top: 30%">
                <img class="inl home-menu-icon no-drag" src="${getProxyPath()}${icon}" />
              </div>
              <div class="abs center" style="top: 75%">${Translate.instance(routeId)}</div>`,
            class: `in fll home-body-btn home-body-btn-${routeId}`,
          })}`;
        }
        return html`
          <div class="style-home-menu-container">
            <style>
              .home-menu-container {
                max-width: ${170 * 4}px;
              }
            </style>
          </div>
          <div class="fl home-menu-container">
            <div class="in home-h1-font-container">
              <img
                class="in ${vitaintegralMod ? `vitaintegral-banner` : `healthcare-banner`} hide"
                src="${getProxyPath()}assets/${vitaintegralMod ? `vitaintegral/logo.png` : `icons/23.png`}"
              />
              ${Translate.instance('¿')}${Translate.instance('home-getting')}
            </div>
            ${render}
          </div>
        `;
      },
    });
    ShellNavigation.bind(navigation);
  }
}

export { AppShellHealthcare };
