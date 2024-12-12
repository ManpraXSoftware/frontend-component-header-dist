function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import HeaderLogo from "./header-logo";
import accessibilityIcon from './assets/accessibilityIcon.png';
import axios from 'axios';
import Cookies from 'js-cookie';
class Header extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleLangOptionsClick", e => {
      let current_url = window.location.href;
      let flag = true;
      var setLang = e.target.value;
      localStorage.setItem("langButtonClicked", true);
      localStorage.setItem("lang", e.target.value);
      Cookies.set('lang', setLang, {
        domain: process.env.SITE_DOMAIN,
        path: '/',
        secure: false,
        sameSite: "Lax"
      });
      var all_darkLangs_dict = this.state.darkLanguages;
      if (all_darkLangs_dict.includes(setLang) && setLang != 'en') {
        if (current_url.includes('/explore-courses/explore-programs') || current_url.includes('/explore-courses/explore-topics/') || current_url.includes('/courses/course-')) window.location.href = window.location.origin + '/explore-courses/#main';else window.location.reload();
      }
      if (!all_darkLangs_dict.includes(setLang) || setLang == 'en') {
        window.location.reload();
      }
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
    this.state = {
      darkLanguages: [],
      languages: [],
      lang_key: ''
    };
  }
  componentDidMount() {
    var darkLang = [];
    var current_lang = Cookies.get('lang', {
      domain: process.env.SITE_DOMAIN,
      path: '/',
      secure: false,
      sameSite: "Lax"
    });
    const jf = document.createElement('script');
    jf.src = `${process.env.LMS_BASE_URL}/static/js/toolkitjs/vebarl.js`;
    jf.type = 'text/javascript';
    jf.id = 'external_js';
    jf.setAttribute("lms_base_url", process.env.LMS_BASE_URL + '/');
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
      key: 'zKxxnKn5hZxwu',
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
    langSelect.addEventListener('click', this.handleLangOptionsClick);
    let selectTag = document.getElementById("langOptions");
    const lang_dict = [];
    axios.get(process.env.LMS_BASE_URL + `/mx-user-info/get_user_profile?email=${Cookies.get("email")}`).then(res => {
      document.getElementById("header-username").innerText = res.data.username;
      document.getElementById("profileimageid").src = process.env.LMS_BASE_URL + res.data.profileImage.medium;
      document.getElementById("user-profiler-redirect").href = process.env.PROFILE_BASE_URL + res.data.username;
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
        } else {
          options[i].removeAttribute("selected", true);
        }
      }
    });
    Localize.getAvailableLanguages((error, data) => {
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
          "name": e.name,
          "code": e.code
        });
      });
    });
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
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "uai userway_dark",
      id: "userwayAccessibilityIcon",
      "aria-label": "accessibility menu",
      role: "button",
      tabIndex: 1
    }, /*#__PURE__*/React.createElement("img", {
      alt: "Accessibility Widget",
      src: accessibilityIcon,
      className: "ui_w",
      width: "35",
      height: "35"
    })), /*#__PURE__*/React.createElement("header", {
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
      href: process.env.LMS_BASE_URL + '/dashboard/programs/',
      accessKey: "s",
      "aria-current": "page"
    }, "Dashboard"))), /*#__PURE__*/React.createElement("div", {
      className: "search_box"
    }, /*#__PURE__*/React.createElement("form", {
      className: "headerSearchForm",
      onSubmit: e => {
        e.preventDefault();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      role: "search"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "heardeSearch",
      name: "Search for topic of interest",
      placeholder: "Search for topic of interest",
      className: "enter",
      onChange: e => {}
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
    }, /*#__PURE__*/React.createElement("span", {
      className: "fa fa-caret-down",
      "aria-hidden": "true"
    })), /*#__PURE__*/React.createElement("div", {
      className: "dropdown-user-menu hidden",
      "aria-label": "More Options",
      role: "menu",
      id: "user-menu",
      tabIndex: -1
    }, /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item",
      id: "dashboard-navbar"
    }, /*#__PURE__*/React.createElement("a", {
      href: process.env.LMS_BASE_URL + 'dashboard/programs/',
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
      href: process.env.LMS_BASE_URL + '/account/settings',
      role: "menuitem"
    }, "Account")), /*#__PURE__*/React.createElement("div", {
      className: "mobile-nav-item dropdown-item dropdown-nav-item"
    }, /*#__PURE__*/React.createElement("a", {
      href: process.env.LMS_BASE_URL + '/logout',
      role: "menuitem"
    }, "Sign Out")))))))));
  }
}
export default Header;
//# sourceMappingURL=Header.js.map