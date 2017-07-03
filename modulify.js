import _ from 'lodash';

export default (namespace, module) => {
  const paths = _.isString(namespace) ? namespace.split('/') : namespace;

  const namespaced = {
    modules: {},
  };

  const last = _.reduce(paths, (current, path) => {
    const next = {
      namespaced: true,
      modules: {},
    };

    current.modules[path] = next;

    return next;
  }, namespaced);

  _.merge(last, module);

  return namespaced.modules;
};
