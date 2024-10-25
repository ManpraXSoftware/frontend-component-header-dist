import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import genericMessages from '../generic/messages';
const AnonymousUserMenu = _ref => {
  let {
    intl
  } = _ref;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    className: "mr-3",
    variant: "outline-primary",
    href: `${getConfig().LMS_BASE_URL}/register?next=${encodeURIComponent(global.location.href)}`
  }, intl.formatMessage(genericMessages.registerSentenceCase)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: `${getLoginRedirectUrl(global.location.href)}`
  }, intl.formatMessage(genericMessages.signInSentenceCase)));
};
AnonymousUserMenu.propTypes = {
  intl: intlShape.isRequired
};
export default injectIntl(AnonymousUserMenu);
//# sourceMappingURL=AnonymousUserMenu.js.map