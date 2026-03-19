const React = require('react');

function SvgrMock(props) {
  return React.createElement('svg', props);
}

module.exports = {
  __esModule: true,
  default: SvgrMock,
  ReactComponent: SvgrMock,
};
