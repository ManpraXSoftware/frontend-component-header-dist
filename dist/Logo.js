const _excluded = ["src", "alt"],
  _excluded2 = ["href", "src", "alt"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import React from 'react';
import PropTypes from 'prop-types';
const Logo = _ref => {
  let {
      src,
      alt
    } = _ref,
    attributes = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: alt
  }, attributes));
};
Logo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};
const LinkedLogo = _ref2 => {
  let {
      href,
      src,
      alt
    } = _ref2,
    attributes = _objectWithoutProperties(_ref2, _excluded2);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, attributes), /*#__PURE__*/React.createElement("img", {
    className: "d-block",
    src: src,
    alt: alt
  }));
};
LinkedLogo.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};
export { LinkedLogo, Logo };
export default Logo;
//# sourceMappingURL=Logo.js.map