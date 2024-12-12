import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, Button, Container, Icon, IconButton, Nav, Row } from '@openedx/paragon';
import { Close, MenuIcon, Search } from '@openedx/paragon/icons';
import CourseLockUp from './CourseLockUp';
import UserMenu from './UserMenu';
import BrandNav from './BrandNav';
import NavDropdownMenu from './NavDropdownMenu';
import messages from './messages';
const HeaderBody = _ref => {
  let {
    logo,
    logoAltText,
    number,
    org,
    title,
    username,
    isAdmin,
    studioBaseUrl,
    logoutUrl,
    authenticatedUserAvatar,
    isMobile,
    setModalPopupTarget,
    toggleModalPopup,
    isModalPopupOpen,
    isHiddenMainMenu,
    mainMenuDropdowns,
    outlineLink,
    searchButtonAction
  } = _ref;
  const intl = useIntl();
  const renderBrandNav = /*#__PURE__*/React.createElement(BrandNav, {
    studioBaseUrl,
    logo,
    logoAltText
  });
  return /*#__PURE__*/React.createElement(Container, {
    size: "xl",
    className: "px-2.5"
  }, /*#__PURE__*/React.createElement(ActionRow, {
    as: "header"
  }, isHiddenMainMenu ? /*#__PURE__*/React.createElement(Row, {
    className: "flex-nowrap ml-4"
  }, renderBrandNav) : /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement(Button, {
    ref: setModalPopupTarget,
    className: "d-inline-flex align-items-center",
    variant: "tertiary",
    onClick: toggleModalPopup,
    iconBefore: isModalPopupOpen ? Close : MenuIcon,
    "data-testid": "mobile-menu-button"
  }, "Menu") : /*#__PURE__*/React.createElement("div", {
    className: "w-25"
  }, /*#__PURE__*/React.createElement(Row, {
    className: "m-0 flex-nowrap"
  }, renderBrandNav, /*#__PURE__*/React.createElement(CourseLockUp, {
    outlineLink,
    number,
    org,
    title
  }))), isMobile ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ActionRow.Spacer, null), renderBrandNav) : /*#__PURE__*/React.createElement(Nav, {
    "data-testid": "desktop-menu",
    className: "ml-2"
  }, mainMenuDropdowns.map(dropdown => {
    const {
      id,
      buttonTitle,
      items
    } = dropdown;
    return /*#__PURE__*/React.createElement(NavDropdownMenu, {
      key: id,
      id,
      buttonTitle,
      items
    });
  }))), /*#__PURE__*/React.createElement(ActionRow.Spacer, null), searchButtonAction && /*#__PURE__*/React.createElement(Nav, null, /*#__PURE__*/React.createElement(IconButton, {
    src: Search,
    iconAs: Icon,
    onClick: searchButtonAction,
    "aria-label": intl.formatMessage(messages['header.label.search.nav'])
  })), /*#__PURE__*/React.createElement(Nav, null, /*#__PURE__*/React.createElement(UserMenu, {
    username,
    studioBaseUrl,
    logoutUrl,
    authenticatedUserAvatar,
    isAdmin
  }))));
};
HeaderBody.propTypes = {
  studioBaseUrl: PropTypes.string.isRequired,
  logoutUrl: PropTypes.string.isRequired,
  setModalPopupTarget: PropTypes.func,
  toggleModalPopup: PropTypes.func,
  isModalPopupOpen: PropTypes.bool,
  number: PropTypes.string,
  org: PropTypes.string,
  title: PropTypes.string,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  authenticatedUserAvatar: PropTypes.string,
  username: PropTypes.string,
  isAdmin: PropTypes.bool,
  isMobile: PropTypes.bool,
  isHiddenMainMenu: PropTypes.bool,
  mainMenuDropdowns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    buttonTitle: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string
    }))
  })),
  outlineLink: PropTypes.string,
  searchButtonAction: PropTypes.func
};
HeaderBody.defaultProps = {
  setModalPopupTarget: null,
  toggleModalPopup: null,
  isModalPopupOpen: false,
  logo: null,
  logoAltText: null,
  number: '',
  org: '',
  title: '',
  authenticatedUserAvatar: null,
  username: null,
  isAdmin: false,
  isMobile: false,
  isHiddenMainMenu: false,
  mainMenuDropdowns: [],
  outlineLink: null,
  searchButtonAction: null
};
export default HeaderBody;
//# sourceMappingURL=HeaderBody.js.map