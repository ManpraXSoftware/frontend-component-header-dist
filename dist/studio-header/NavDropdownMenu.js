import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownButton } from '@openedx/paragon';
const NavDropdownMenu = _ref => {
  let {
    id,
    buttonTitle,
    items
  } = _ref;
  return /*#__PURE__*/React.createElement(DropdownButton, {
    id: id,
    title: buttonTitle,
    variant: "outline-primary",
    className: "mr-2"
  }, items.map(item => /*#__PURE__*/React.createElement(Dropdown.Item, {
    key: `${item.title}-dropdown-item`,
    href: item.href,
    className: "small"
  }, item.title)));
};
NavDropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.string
  })).isRequired
};
export default NavDropdownMenu;
//# sourceMappingURL=NavDropdownMenu.js.map