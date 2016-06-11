'use strict';

const lo_findIndex = require('lodash.findindex');
const lo_orderBy = require('lodash.orderby');
const path = require('path');
const matchutil = require('../../utils/matchutil');

const BASENAME_MATCH_WEIGHT = 2.0;

function combineFuzzyResults(combinedTarget, source) {
  for (const x of source) {
    const allpath = x.path;
    const idx = lo_findIndex(combinedTarget, { path: allpath });
    // Append if there is no this item on combinedTarget
    if (idx < 0) {
      combinedTarget.push(x);
      continue;
    }
    // Replace after comparing
    const old = combinedTarget[idx];
    if (old.score >= x.score)
      continue;
    combinedTarget[idx] = x;
  }
}

function fuzzy(items, query) {
  const resultsByPath = matchutil.fuzzy(items, query).slice(0, 20).map(x => {
    return {
      path: x.elem,
      html: matchutil.makeStringBoldHtml(x.elem, x.matches),
      score: x.score
    };
  });
  const resultsByBasename = matchutil.fwdfuzzy(items, query, x => path.basename(x, path.extname(x))).slice(0, 20).map(x => {
    const allpath = x.elem;
    const extname = path.extname(allpath);
    const basename = path.basename(allpath, extname);
    const containerPath = allpath.substring(0, allpath.length - basename.length - extname.length);
    const html = matchutil.makeStringBoldHtml(basename, x.matches);
    return {
      path: allpath,
      html: containerPath + html + extname,
      score: x.score * BASENAME_MATCH_WEIGHT
    };
  });
  const combined = [];
  combineFuzzyResults(combined, resultsByPath);
  combineFuzzyResults(combined, resultsByBasename);
  const result = lo_orderBy(combined, ['score'], ['desc']);
  return result;
}

module.exports = { fuzzy };
