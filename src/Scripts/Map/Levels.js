define('Levels', ['../Utility/StringHelper'], (StringHelper) => {
  this.load = function load(isTest = false) {
    const stringHelper = new StringHelper();
    // Todo: Move mocks to test project.
    const requireContext = isTest
      ? require.context('json!../../../test/Map', false, /\.json$/)
      : require.context('json!../../Assets/Levels', false, /\.json$/);
    const json = {};
    requireContext.keys().forEach((k) => {
      const obj = requireContext(k);
      const key = stringHelper.getFileNameOnly(k);
      json[key] = obj;
    });
    return json;
  };
});
