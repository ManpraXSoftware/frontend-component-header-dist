function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import HeaderLogo from "./header-logo";
import accessibilityIcon from './assets/accessibilityIcon.png';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import CaretDropDownIcon from './Icons';
import $ from 'jquery';
class Header extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleLangOptionsClick", e => {
      e.preventDefault();
      e.stopPropagation();
      const selectedLang = e.target.value; // Get the selected language code
      const currentLang = Cookies.get('lang', {
        domain: getConfig().SITE_DOMAIN[0],
        path: '/',
        secure: false,
        sameSite: "Lax"
      });

      // If the selected language is the same as the current language, do nothing
      if (selectedLang === currentLang) {
        return;
      }
      let current_url = window.location.href;
      let base_url = window.location.origin;
      let text = "Do you want to change the language? You will be redirected to the 'explore courses' page";
      if (current_url.includes('explore-courses/program-courses') || current_url.includes('explore-courses/#main') || current_url === `${base_url}/explore-courses/` || current_url === `${base_url}/explore-courses` || current_url.includes('explore-courses/search')) {
        this.chngLang(e);
      } else {
        // Use a custom confirmation dialog
        this.showCustomConfirmDialog(text, () => {
          this.chngLang(e);
        }, () => {
          const langSelect = document.getElementById('langOptions');
          langSelect.value = currentLang;
        });
      }
    });
    // Custom confirmation dialog
    // Custom confirmation dialog
    _defineProperty(this, "showCustomConfirmDialog", (message, onConfirm, onCancel) => {
      // Create dialog elements
      const modal = document.createElement('div');
      modal.setAttribute('id', 'customConfirmModal');
      modal.setAttribute('tabindex', '-1');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      const dialog = document.createElement('div');
      dialog.style.backgroundColor = '#fff';
      dialog.style.padding = '20px';
      dialog.style.borderRadius = '8px';
      dialog.style.textAlign = 'center';
      dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
      messageElem.setAttribute('tabindex', '0'); // Make it focusable

      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirm';
      confirmButton.style.margin = '0 10px';
      var modalNodes = Array.from(document.querySelectorAll('#customConfirmModal *'));
      var nonModalNodes = document.querySelectorAll('body *:not(#customConfirmModal):not([tabindex="-1"])');
      for (var i = 0; i < nonModalNodes.length; i++) {
        var node = nonModalNodes[i];
        if (!modalNodes.includes(node)) {
          node._prevTabindex = node.getAttribute('tabindex');
          node.setAttribute('tabindex', -1);
          node.style.outline = 'none';
        }
      }
      confirmButton.onclick = () => {
        document.body.removeChild(modal);
        onConfirm();
      };
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.margin = '0 10px';
      cancelButton.onclick = () => {
        document.body.removeChild(modal);
        onCancel();
        document.body.style.overflow = null;
        for (var i = 0; i < nonModalNodes.length; i++) {
          var node = nonModalNodes[i];
          if (node._prevTabindex) {
            node.setAttribute('tabindex', node._prevTabindex);
            node._prevTabindex = null;
          } else {
            node.removeAttribute('tabindex');
          }
          node.style.outline = null;
        }
      };

      // Append elements
      dialog.appendChild(messageElem);
      dialog.appendChild(confirmButton);
      dialog.appendChild(cancelButton);
      modal.appendChild(dialog);
      document.body.appendChild(modal);

      // Focus on the message element
      messageElem.focus();

      // Close modal on outside click
      modal.addEventListener('click', event => {
        if (event.target === modal) {
          document.body.removeChild(modal);
          onCancel();
          document.body.style.overflow = null;
          for (var i = 0; i < nonModalNodes.length; i++) {
            var node = nonModalNodes[i];
            if (node._prevTabindex) {
              node.setAttribute('tabindex', node._prevTabindex);
              node._prevTabindex = null;
            } else {
              node.removeAttribute('tabindex');
            }
            node.style.outline = null;
          }
        }
      });
    });
    _defineProperty(this, "chngLang", e => {
      let current_url = window.location.href;
      var setLang = e.target.value;
      localStorage.setItem("langButtonClicked", true);
      localStorage.setItem("lang", e.target.value);
      Cookies.set('lang', setLang, {
        domain: getConfig().SITE_DOMAIN[0],
        path: '/',
        secure: false,
        sameSite: "Lax"
      });
      if (current_url.includes('/explore-courses/explore-programs') || current_url.includes('/explore-courses/explore-topics/')) {
        window.location.href = window.location.origin + '/explore-courses/#main';
      } else {
        window.location.reload();
      }

      // if (all_darkLangs_dict.includes(setLang) && setLang != 'en') {
      //   if (current_url.includes('/explore-courses/explore-programs') || current_url.includes('/explore-courses/explore-topics/') || current_url.includes('/courses/course-'))

      //     window.location.href = window.location.origin + '/explore-courses/#main';
      //   else
      //     window.location.reload()

      // }

      // if ((!(all_darkLangs_dict.includes(setLang)) || setLang == 'en')) {
      //   window.location.reload()
      // }

      Localize.setLanguage(setLang);
      $('#langOptions > option').each(function () {
        if (setLang == $(this).val()) {
          $(this).attr('selected', true);
        } else {
          $(this).removeAttr("selected");
        }
      });
      setTimeout(() => {
        Localize.untranslate($(".myLang").get(0));
      }, 100);
    });
    //Search
    _defineProperty(this, "handleSearchClick", e => {
      e.preventDefault();
      let searchData = $('.enter').val();
      if (searchData != "") {
        let url = getConfig().EXPLORE_COURSE_URL[0] + `/search?text=${searchData}`;
        window.location = url;
      }
    });
    this.state = {
      darkLanguages: [],
      languages: [],
      lang_key: '',
      setText: ''
    };
  }
  componentDidMount() {
    var darkLang = [];
    const {
      authenticatedUser
    } = this.context;
    if (!authenticatedUser || !authenticatedUser.email) {
      const loginUrl = getConfig().LOGIN_URL;
      window.location.href = loginUrl;
      return; // Stop further execution
    }
    console.log("site domain", getConfig().SITE_DOMAIN, getConfig().EXPLORE_COURSE_URL);
    const search_query = new URLSearchParams(location.search).get("text");
    this.setState({
      setText: search_query || ''
    }); // Fallback to an empty string
    var current_lang = Cookies.get('lang', {
      domain: getConfig().SITE_DOMAIN[0],
      path: '/',
      secure: false,
      sameSite: "Lax"
    });
    if (!current_lang) {
      // Check for undefined, null, or empty string
      current_lang = 'en';
    }
    const jf = document.createElement('script');

    // const mx_localizekey = getConfig().MX_LOCALIZEKEY[0];

    const mx_localizekey = Array.isArray(getConfig().MX_LOCALIZEKEY) ? getConfig().MX_LOCALIZEKEY[0] : getConfig().MX_LOCALIZEKEY;

    // console.log("localizer key", mx_localizekey)

    const show_user_way = getConfig().SHOW_USER_WAY[0];
    if (show_user_way == "True") {
      const script = document.createElement('script');
      const user_way_key = getConfig().USER_WAY_KEY[0];
      script.src = 'https://cdn.userway.org/widget.js';
      script.setAttribute('data-account', user_way_key);
      script.async = true;
      document.body.appendChild(script);
    }
    jf.type = 'text/javascript';
    jf.id = 'external_js';
    jf.setAttribute("lms_base_url", getConfig().LMS_BASE_URL + '/');
    const parentDiv = document.getElementById('nett-head');
    const localizeScript = document.createElement('script');
    localizeScript.src = "https://global.localizecdn.com/localize.js";
    const jqueryScript = document.createElement('script');
    jqueryScript.src = "https://code.jquery.com/jquery-3.7.1.js";
    jqueryScript.integrity = "sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=";
    jqueryScript.crossOrigin = "anonymous";
    const localizeInnerText = document.createElement("script");
    localizeInnerText.innerText = !function (a) {
      if (!a.Localize) {
        a.Localize = {};
        for (var e = ["translate", "untranslate", "phrase", "initialize", "translatePage", "setLanguage", "getLanguage", "getSourceLanguage", "detectLanguage", "getAvailableLanguages", "untranslatePage", "bootstrap", "prefetch", "on", "off", "hideWidget", "showWidget"], t = 0; t < e.length; t++) a.Localize[e[t]] = function () {};
      }
    }(window);
    const localizeKey = document.createElement("script");
    localizeKey.innerText = Localize.initialize({
      key: mx_localizekey,
      rememberLanguage: true
    });
    const langSelect = document.createElement("select");
    langSelect.id = "langOptions";
    langSelect.className = "myLang";
    langSelect.ariaLabel = "Selected language";
    parentDiv.append(jf);
    parentDiv.append(jqueryScript);
    parentDiv.append(localizeInnerText);
    parentDiv.append(localizeKey);
    parentDiv.append(langSelect);
    const bodyDiv = document.body;
    bodyDiv.append(localizeScript);
    langSelect.addEventListener('change', this.handleLangOptionsClick);
    let selectTag = document.getElementById("langOptions");
    const lang_dict = [];
    localizeScript.onload = () => {
      console.log("initialing localizer ...");
      Localize.initialize({
        key: mx_localizekey,
        rememberLanguage: true
      });
      Localize.getAvailableLanguages((error, data) => {
        if (error) {
          console.error('Error fetching available languages:', error);
        } else {
          data.map((e, i) => {
            var lang_name = e.name;
            if (e.code == "hi-IN" || e.code == "hi") {
              lang_name = e.name + "(Hindi)";
            } else if (e.code == "kn") {
              lang_name = e.name + "(Kannada)";
            } else if (e.code == "bn") {
              lang_name = e.name + "(Bangali)";
            } else if (e.code == "en") {
              lang_name = e.name + "(English)";
            } else if (e.code == "ta-IN") {
              lang_name = e.name + "(Tamil (India))";
            } else if (e.code == "or") {
              lang_name = e.name + "(Odia)";
            } else if (e.code == "ml-IN" || e.code == "ml") {
              lang_name = e.name + "(Malayalam)";
            }
            lang_dict.push({
              "name": lang_name,
              "code": e.code
            });
          });
          console.log('Available languages:', data);
        }
      });
      axios.get(getConfig().LMS_BASE_URL + `/mx-user-info/get_user_profile?email=${authenticatedUser.email}`).then(res => {
        document.getElementById("header-username").innerText = res.data.username;
        document.getElementById("profileimageid").src = getConfig().LMS_BASE_URL + res.data.profileImage.medium;
        document.getElementById("user-profiler-redirect").href = getConfig().ACCOUNT_PROFILE_URL + '/u/' + res.data.username;
        const dashboardDiv = document.getElementById('dashboard-navbar');
        if (dashboardDiv && res.data.resume_block) {
          const newDiv = document.createElement('div');
          newDiv.className = 'mobile-nav-item dropdown-item dropdown-nav-item';
          newDiv.innerHTML = `<a href=${res.data.resume_block} role="menuitem">Resume your last course</a>`;
          dashboardDiv.parentNode.insertBefore(newDiv, dashboardDiv);
        }
        ;
        for (let i = 0; i < res.data.dark_languages.length; i++) {
          var code = res.data.dark_languages[i][0];
          var name = res.data.dark_languages[i][1];
          if (code != 'en') {
            if (code == "hi-IN" || code == "hi") {
              name = name + "(Hindi)";
            } else if (code == "kn") {
              name = name + "(Kannada)";
            } else if (code == "bn") {
              name = name + "(Bangali)";
            } else if (code == "en") {
              name = name + "(English)";
            } else if (code == "ta-IN") {
              name = name + "(Tamil (India))";
            } else if (code == "or") {
              name = name + "(Odia)";
            } else if (code == "ml-IN" || code == "ml") {
              name = name + "(Malayalam)";
            } else if (code == "gu") {
              name = name + "(Gujrati)";
            }
            darkLang.push(code);
            lang_dict.push({
              "name": name,
              "code": code
            });
          }
        }
        this.setState({
          languages: lang_dict
        });
        this.state.languages.map((lang, i) => {
          var option = new Option(lang.name, lang.code);
          selectTag.append(option);
        });
        const options = selectTag.options;
        for (let i = 0; i < options.length; i++) {
          if (current_lang == options[i].value) {
            options[i].setAttribute("selected", true);
            Localize.setLanguage(current_lang);
            Cookies.set('lang', current_lang, {
              domain: getConfig().SITE_DOMAIN[0],
              path: '/',
              secure: false,
              sameSite: "Lax"
            });
          } else {
            options[i].removeAttribute("selected", true);
          }
        }
      });
    };
    this.setState({
      darkLanguages: darkLang
    });
    $('#langOptions > option').each(function () {
      if (current_lang == $(this).val()) {
        $(this).attr('selected', true);
      } else {
        $(this).removeAttr("selected");
      }
    });

    // Hide languages Dropdown on course page 
    let current_url = window.location.href;
    if (current_url.includes('learning/course/')) {
      $(".myLang").hide();

      //  LTS WAT Code START : DO NOT REMOVE or MODIFY 
      //  Create and append the LTS script
      // const ltsScript = document.createElement('script');
      // ltsScript.src = `https://lts.lb.gcloud.letstalksign.org/script/lts-load-lms-V1-OB.js?auth_api=${getConfig().LMS_BASE_URL}/letstalksign/authenticate`;
      // ltsScript.async = true;
      // document.body.appendChild(ltsScript);
      //  LTS WAT Code END : DO NOT REMOVE or MODIFY 
    }

    // if (document.readyState === 'complete') {
    //   console.log('DOM and all resources have fully loaded');
    // } else if (document.readyState === 'interactive') {
    //     console.log('DOM fully loaded and parsed, but resources may still be loading');

    // } else {
    //     console.log('DOM is still loading');

    // }
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
      className: "global-header",
      id: "nett-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main-header"
    }, /*#__PURE__*/React.createElement(HeaderLogo, null), /*#__PURE__*/React.createElement("div", {
      className: "hamburger-menu",
      role: "button",
      "aria-label": "Options Menu",
      "aria-expanded": false,
      "aria-controls": "mobile-menu",
      tabIndex: 0
    }, /*#__PURE__*/React.createElement("span", {
      className: "line"
    }), /*#__PURE__*/React.createElement("span", {
      className: "line"
    }), /*#__PURE__*/React.createElement("span", {
      className: "line"
    }), /*#__PURE__*/React.createElement("span", {
      className: "line"
    })), /*#__PURE__*/React.createElement("div", {
      className: "nav-links"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement("nav", {
      className: "navbar navbar-expand-sm   navbar-light bg-light head_menu",
      "aria-label": "primary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "collapse navbar-collapse",
      id: "navbarTogglerDemo03"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "navbar-nav mr-auto mt-2 mt-lg-0 menu_list"
    }, /*#__PURE__*/React.createElement("li", {
      className: "nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      className: window.location.href.includes('/explore-courses/') ? 'active tab-nav-link' : 'tab-nav-link',
      href: "/explore-courses/",
      accessKey: "c",
      "aria-current": "page"
    }, "Explore Courses")), /*#__PURE__*/React.createElement("li", {
      className: "nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      className: window.location.href.includes('dashboard/programs/') ? 'active tab-nav-link' : 'tab-nav-link',
      href: getConfig().LMS_BASE_URL + '/dashboard/programs/',
      accessKey: "s",
      "aria-current": "page"
    }, "Dashboard"))), /*#__PURE__*/React.createElement("div", {
      className: "search_box1"
    }, /*#__PURE__*/React.createElement("form", {
      className: "headerSearchForm",
      onSubmit: this.handleSearchClick
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      role: "search"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "heardeSearch",
      value: this.state.setText,
      onChange: e => {
        this.setState({
          setText: e.target.value
        }); // Update state correctly
      },
      name: "Search for topic of interest",
      placeholder: "Search for topic of interest",
      className: "enter"
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "",
      className: "submit",
      "aria-label": "Search"
    }))))))), /*#__PURE__*/React.createElement("div", {
      className: "secondary",
      onClick: e => {
        document.getElementById("user-menu").classList.toggle("hidden");
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nav-item hidden-mobile user_custom_login toggle-user-dropdown",
      "aria-label": "User Account Options",
      "aria-expanded": "false",
      tabIndex: 0,
      "aria-controls": "user-menu"
    }, /*#__PURE__*/React.createElement("span", {
      className: "menu-title",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("img", {
      className: "user-image-frame",
      id: "profileimageid",
      src: "",
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "sr-only",
      "aria-disabled": "true"
    }, "Dashboard for:"), /*#__PURE__*/React.createElement("span", {
      className: "username",
      "aria-disabled": "true",
      id: "header-username"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "nav-item hidden-mobile nav-item-dropdown"
    }, /*#__PURE__*/React.createElement("div", {
      className: "toggle-user-dropdown",
      role: "button",
      "aria-label": "Options Menu",
      "aria-expanded": "false",
      tabIndex: -1,
      "aria-controls": "user-menu"
    }, /*#__PURE__*/React.createElement(CaretDropDownIcon, null)), /*#__PURE__*/React.createElement("div", {
      className: "dropdown-user-menu hidden",
      "aria-label": "More Options",
      role: "menu",
      id: "user-menu",
      tabIndex: -1
    }, /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item",
      id: "dashboard-navbar"
    }, /*#__PURE__*/React.createElement("a", {
      href: getConfig().LMS_BASE_URL + '/dashboard/programs/',
      role: "menuitem"
    }, "Dashboard")), /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      id: "user-profiler-redirect",
      href: "",
      role: "menuitem"
    }, "Profile")), /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      href: getConfig().ACCOUNT_SETTINGS_URL,
      role: "menuitem"
    }, "Account")), /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      href: getConfig().LOGOUT_URL,
      role: "menuitem"
    }, "Sign Out")))))))));
  }
}
_defineProperty(Header, "contextType", AppContext);
export default Header;
//# sourceMappingURL=Header.js.map