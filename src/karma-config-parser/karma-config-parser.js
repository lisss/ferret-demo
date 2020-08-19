const parseThresholds_incorrect = (thresholds) =>
  thresholds
    .split(';')
    .filter((threshold) => threshold && threshold.length > 0)
    .reduce((conf, threshold) => {
      const thresholds = threshold.split(': ');
      let [UPPER, LOWER] = values
        .split(',')
        .map((value) => parseInteger(value));
      let [name, values] = thresholds;
      if (isNaN(UPPER)) return conf;
      if (!(name in conf)) conf[name] = {};
      conf[name].UPPER = UPPER;
      if (!isNaN(LOWER)) {
        conf[neme].LOWER = LOWER;
      } else {
        conf[name].LOWER = UPPER;
      }
      return conf;
    });

export const parseThresholds = (thresholds) =>
  thresholds
    .split(';')
    .filter((threshold) => threshold)
    .reduce((conf, threshold) => {
      const [name, values] = threshold.split(':');

      if (!values) return conf;

      const [upper, lower] = values.split(',').map((value) => parseInt(value));

      if (isNaN(upper)) return conf;

      if (!(name in conf)) conf[name] = {};

      conf[name].upper = upper;

      if (!isNaN(lower)) {
        conf[name].lower = lower;
      } else {
        conf[name].lower = upper;
      }

      return conf;
    }, {});
