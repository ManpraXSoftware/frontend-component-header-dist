function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import { CaretIcon } from './Icons';
class DesktopHeader extends React.Component {
  constructor(props) {
    // eslint-disable-line no-useless-constructor
    super(props);
  }
  renderMenu(menu) {
    // Nodes are accepted as a prop
    if (!Array.isArray(menu)) {
      return menu;
    }
    return menu.map(menuItem => {
      const {
        type,
        href,
        content,
        submenuContent,
        disabled,
        isActive,
        onClick
      } = menuItem;
      if (type === 'item') {
        return /*#__PURE__*/React.createElement("a", {
          key: `${type}-${content}`,
          className: `nav-link${disabled ? ' disabled' : ''}${isActive ? ' active' : ''}`,
          href: href,
          onClick: onClick || null
        }, content);
      }
      return /*#__PURE__*/React.createElement(Menu, {
        key: `${type}-${content}`,
        tag: "div",
        className: "nav-item",
        respondToPointerEvents: true
      }, /*#__PURE__*/React.createElement(MenuTrigger, {
        onClick: onClick || null,
        tag: "a",
        className: "nav-link d-inline-flex align-items-center",
        href: href
      }, content, " ", /*#__PURE__*/React.createElement(CaretIcon, {
        role: "img",
        "aria-hidden": true,
        focusable: "false"
      })), /*#__PURE__*/React.createElement(MenuContent, {
        className: "pin-left pin-right shadow py-2"
      }, submenuContent));
    });
  }
  renderMainMenu() {
    const {
      mainMenu
    } = this.props;
    return this.renderMenu(mainMenu);
  }
  renderSecondaryMenu() {
    const {
      secondaryMenu
    } = this.props;
    return this.renderMenu(secondaryMenu);
  }
  renderUserMenu() {
    const {
      userMenu,
      avatar,
      username,
      intl
    } = this.props;
    return /*#__PURE__*/React.createElement(Menu, {
      transitionClassName: "menu-dropdown",
      transitionTimeout: 250
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      "aria-label": intl.formatMessage(messages['header.label.account.menu.for'], {
        username
      }),
      className: "btn btn-outline-primary d-inline-flex align-items-center pl-2 pr-3"
    }, /*#__PURE__*/React.createElement(Avatar, {
      size: "1.5em",
      src: avatar,
      alt: "",
      className: "mr-2"
    }), username, " ", /*#__PURE__*/React.createElement(CaretIcon, {
      role: "img",
      "aria-hidden": true,
      focusable: "false"
    })), /*#__PURE__*/React.createElement(MenuContent, {
      className: "mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2"
    }, userMenu.map((group, index) =>
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-comment-textnodes,react/no-array-index-key
    React.createElement(React.Fragment, {
      key: index
    }, group.heading && /*#__PURE__*/React.createElement("div", {
      className: "dropdown-header",
      role: "heading",
      "aria-level": "1"
    }, group.heading), group.items.map(_ref => {
      let {
        type,
        content,
        href,
        disabled,
        isActive,
        onClick
      } = _ref;
      return /*#__PURE__*/React.createElement("a", {
        className: `dropdown-${type}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`,
        key: `${type}-${content}`,
        href: href,
        onClick: onClick || null
      }, content);
    }), index < userMenu.length - 1 && /*#__PURE__*/React.createElement("div", {
      className: "dropdown-divider",
      role: "separator"
    })))));
  }
  renderLoggedOutItems() {
    const {
      loggedOutItems
    } = this.props;
    return loggedOutItems.map((item, i, arr) => /*#__PURE__*/React.createElement("a", {
      key: `${item.type}-${item.content}`,
      className: i < arr.length - 1 ? 'btn mr-2 btn-link' : 'btn mr-2 btn-outline-primary',
      href: item.href
    }, item.content));
  }
  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      intl
    } = this.props;
    const logoProps = {
      src: logo,
      alt: logoAltText,
      href: logoDestination
    };
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;
    return /*#__PURE__*/React.createElement("header", {
      className: "site-header-desktop"
    }, /*#__PURE__*/React.createElement("a", {
      className: "nav-skip sr-only sr-only-focusable",
      href: "#main"
    }, intl.formatMessage(messages['header.label.skip.nav'])), /*#__PURE__*/React.createElement("div", {
      className: `container-fluid ${logoClasses}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "nav-container position-relative d-flex align-items-center"
    }, logoDestination === null ? /*#__PURE__*/React.createElement(Logo, {
      className: "logo",
      src: logo,
      alt: logoAltText
    }) : /*#__PURE__*/React.createElement(LinkedLogo, _extends({
      className: "logo"
    }, logoProps)), /*#__PURE__*/React.createElement("nav", {
      "aria-label": intl.formatMessage(messages['header.label.main.nav']),
      className: "nav main-nav"
    }, this.renderMainMenu()), /*#__PURE__*/React.createElement("nav", {
      "aria-label": intl.formatMessage(messages['header.label.secondary.nav']),
      className: "nav secondary-menu-container align-items-center ml-auto"
    }, loggedIn ? /*#__PURE__*/React.createElement(React.Fragment, null, this.renderSecondaryMenu(), this.renderUserMenu()) : this.renderLoggedOutItems()))));
  }
}
DesktopHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  secondaryMenu: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  userMenu: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
      isActive: PropTypes.bool,
      onClick: PropTypes.func
    }))
  })),
  loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,
  // i18n
  intl: intlShape.isRequired
};
DesktopHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false
};
export default injectIntl(DesktopHeader);
//# sourceMappingURL=DesktopHeader.js.map