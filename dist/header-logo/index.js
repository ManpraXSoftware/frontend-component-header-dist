import React from "react";
import logo from "../assets/logo.png";
import { getConfig } from '@edx/frontend-platform';
const HeaderLogo = () => {
  return /*#__PURE__*/React.createElement("span", {
    className: "header-logo"
  }, /*#__PURE__*/React.createElement("a", {
    href: getConfig().LMS_BASE_URL + '/dashboard/programs/',
    style: {
      margin: "7px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "logo",
    src: logo,
    alt: "Subodha logo"
  })));
};
export default HeaderLogo;
//# sourceMappingURL=index.js.map