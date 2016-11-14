define('Levels', ['../Utility/StringHelper'], (StringHelper) => {
  this.load = function load(isTest = false) {
    const stringHelper = new StringHelper();
    const requireContext = isTest
      ? require.context('json!./Mocks', false, /\.json$/)
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
