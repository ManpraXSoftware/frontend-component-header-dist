import React from 'react';
import PropTypes from 'prop-types';
const BrandNav = _ref => {
  let {
    studioBaseUrl,
    logo,
    logoAltText
  } = _ref;
  return /*#__PURE__*/React.createElement("a", {
    href: studioBaseUrl
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: logoAltText,
    className: "d-block logo"
  }));
};
BrandNav.propTypes = {
  studioBaseUrl: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  logoAltText: PropTypes.string.isRequired
};
export default BrandNav;
//# sourceMappingURL=BrandNav.js.map