const Utility = require('../Utility/Utility');

define('Levels', [], () => {
  this.load = function load(isTest = false) {
    // Todo: Move mocks to test project.
    const requireContext = isTest
      ? require.context('json!../../../test/Map', false, /\.json$/)
      : require.context('json!../../Assets/Levels', false, /\.json$/);
    const json = {};
    requireContext.keys().forEach((k) => {
      const obj = requireContext(k);
      const key = Utility.string.getFileNameOnly(k);
      json[key] = obj;
    });
    return json;
  };
});
