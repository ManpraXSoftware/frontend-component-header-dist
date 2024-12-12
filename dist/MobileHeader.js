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
import { MenuIcon } from './Icons';
class MobileHeader extends React.Component {
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
        className: "nav-item"
      }, /*#__PURE__*/React.createElement(MenuTrigger, {
        onClick: onClick || null,
        tag: "a",
        role: "button",
        tabIndex: "0",
        className: "nav-link"
      }, content), /*#__PURE__*/React.createElement(MenuContent, {
        className: "position-static pin-left pin-right py-2"
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
  renderUserMenuItems() {
    const {
      userMenu
    } = this.props;
    return userMenu.map(group => group.items.map(_ref => {
      let {
        type,
        content,
        href,
        disabled,
        isActive,
        onClick
      } = _ref;
      return /*#__PURE__*/React.createElement("li", {
        className: "nav-item",
        key: `${type}-${content}`
      }, /*#__PURE__*/React.createElement("a", {
        className: `nav-link${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`,
        href: href,
        onClick: onClick || null
      }, content));
    }));
  }
  renderLoggedOutItems() {
    const {
      loggedOutItems
    } = this.props;
    return loggedOutItems.map((_ref2, i, arr) => {
      let {
        type,
        href,
        content
      } = _ref2;
      return /*#__PURE__*/React.createElement("li", {
        className: "nav-item px-3 my-2",
        key: `${type}-${content}`
      }, /*#__PURE__*/React.createElement("a", {
        className: i < arr.length - 1 ? 'btn btn-block btn-outline-primary' : 'btn btn-block btn-primary',
        href: href
      }, content));
    });
  }
  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      avatar,
      username,
      stickyOnMobile,
      intl,
      mainMenu,
      userMenu,
      loggedOutItems
    } = this.props;
    const logoProps = {
      src: logo,
      alt: logoAltText,
      href: logoDestination
    };
    const stickyClassName = stickyOnMobile ? 'sticky-top' : '';
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'justify-content-left pl-3' : 'justify-content-center';
    return /*#__PURE__*/React.createElement("header", {
      "aria-label": intl.formatMessage(messages['header.label.main.header']),
      className: `site-header-mobile d-flex justify-content-between align-items-center shadow ${stickyClassName}`
    }, /*#__PURE__*/React.createElement("a", {
      className: "nav-skip sr-only sr-only-focusable",
      href: "#main"
    }, intl.formatMessage(messages['header.label.skip.nav'])), mainMenu.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "w-100 d-flex justify-content-start"
    }, /*#__PURE__*/React.createElement(Menu, {
      className: "position-static"
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      className: "icon-button",
      "aria-label": intl.formatMessage(messages['header.label.main.menu']),
      title: intl.formatMessage(messages['header.label.main.menu'])
    }, /*#__PURE__*/React.createElement(MenuIcon, {
      role: "img",
      "aria-hidden": true,
      focusable: "false",
      style: {
        width: '1.5rem',
        height: '1.5rem'
      }
    })), /*#__PURE__*/React.createElement(MenuContent, {
      tag: "nav",
      "aria-label": intl.formatMessage(messages['header.label.main.nav']),
      className: "nav flex-column pin-left pin-right border-top shadow py-2"
    }, this.renderMainMenu(), this.renderSecondaryMenu()))) : null, /*#__PURE__*/React.createElement("div", {
      className: `w-100 d-flex ${logoClasses}`
    }, logoDestination === null ? /*#__PURE__*/React.createElement(Logo, {
      className: "logo",
      src: logo,
      alt: logoAltText
    }) : /*#__PURE__*/React.createElement(LinkedLogo, _extends({
      className: "logo"
    }, logoProps, {
      itemType: "http://schema.org/Organization"
    }))), userMenu.length > 0 || loggedOutItems.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "w-100 d-flex justify-content-end align-items-center"
    }, /*#__PURE__*/React.createElement(Menu, {
      tag: "nav",
      "aria-label": intl.formatMessage(messages['header.label.secondary.nav']),
      className: "position-static"
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      className: "icon-button",
      "aria-label": intl.formatMessage(messages['header.label.account.menu']),
      title: intl.formatMessage(messages['header.label.account.menu'])
    }, /*#__PURE__*/React.createElement(Avatar, {
      size: "1.5rem",
      src: avatar,
      alt: username
    })), /*#__PURE__*/React.createElement(MenuContent, {
      tag: "ul",
      className: "nav flex-column pin-left pin-right border-top shadow py-2"
    }, loggedIn ? this.renderUserMenuItems() : this.renderLoggedOutItems()))) : null);
  }
}
MobileHeader.propTypes = {
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
  stickyOnMobile: PropTypes.bool,
  // i18n
  intl: intlShape.isRequired
};
MobileHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
  stickyOnMobile: true
};
export default injectIntl(MobileHeader);
//# sourceMappingURL=MobileHeader.js.map