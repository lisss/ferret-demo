import { parseThresholds } from './karma-config-parser';

describe('test karma config parser', () => {
  it('all values defined', () => {
    expect(parseThresholds('like:2,-2;dislike:1,-20')).toEqual({
      like: { upper: 2, lower: -2 },
      dislike: { upper: 1, lower: -20 },
    });
  });

  it('some config prop has only UPPER value', () => {
    expect(parseThresholds('like:2,-2;dislike:1,-20;report:100')).toEqual({
      like: { upper: 2, lower: -2 },
      dislike: { upper: 1, lower: -20 },
      report: { upper: 100, lower: 100 },
    });
  });

  it('some config prop has no values', () => {
    expect(
      parseThresholds('like:2,-2;dislike:1,-20;report:100;share:')
    ).toEqual({
      like: { upper: 2, lower: -2 },
      dislike: { upper: 1, lower: -20 },
      report: { upper: 100, lower: 100 },
    });
  });

  it('with trailing semicolon', () => {
    expect(parseThresholds('like:2,-2;dislike:1,-20;')).toEqual({
      like: { upper: 2, lower: -2 },
      dislike: { upper: 1, lower: -20 },
    });
  });

  it('all config props have no value', () => {
    expect(parseThresholds('report:;share:')).toEqual({});
  });

  it('config props have invalid values', () => {
    expect(parseThresholds('report:foo,bar')).toEqual({});
  });

  it('invalid config', () => {
    expect(parseThresholds('some string')).toEqual({});
  });
});
