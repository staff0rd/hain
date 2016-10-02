'use strict';

const fs = require('original-fs');
const glob = require('glob');
const co = require('co');
const lo_reject = require('lodash.reject');
const lo_findIndex = require('lodash.findindex');
const path = require('path');

const readdir = require('./readdir');
const util = require('./util');

const RECENT_ITEM_COUNT = 50;
const RECENT_ITEM_RATIO_HIGH = 3;
const RECENT_ITEM_RATIO_LOW = 1.5;

const matchFunc = (filePath, stats) => {
  const ext = path.extname(filePath).toLowerCase();
  if (stats.isDirectory())
    return true;
  return (ext === '.exe' || ext === '.lnk' || ext === '.appref-ms');
};

function injectEnvVariable(dirPath) {
  let _path = dirPath;
  for (const envVar in process.env) {
    const value = process.env[envVar];
    _path = _path.replace(`\${${envVar}}`, value);
  }
  return _path;
}

function injectEnvVariables(dirArr) {
  const newArr = [];
  for (let i = 0; i < dirArr.length; ++i) {
    const dirPath = dirArr[i];
    newArr.push(injectEnvVariable(dirPath));
  }
  return newArr;
}

module.exports = (context) => {
  const logger = context.logger;
  const shell = context.shell;
  const app = context.app;
  const initialPref = context.preferences.get();
  const localStorage = context.localStorage;
  const toast = context.toast;
  let _recentUsedItems = [];

  const recursiveSearchDirs = injectEnvVariables(initialPref.recursiveFolders || []);
  const flatSearchDirs = injectEnvVariables(initialPref.flatFolders || []);

  const db = {};
  const lazyIndexingKeys = {};

  function* refreshIndex(dirs, recursive) {
    for (const dir of dirs) {
      logger.log(`refreshIndex ${dir}`);
      if (fs.existsSync(dir) === false) {
        logger.log(`can't find a dir: ${dir}`);
        continue;
      }
      const files = yield co(readdir(dir, recursive, matchFunc));
      db[dir] = files;
      logger.log(`index updated ${dir}, ${files.length} files`);
    }
  }

  function lazyRefreshIndex(dir, recursive) {
    const _lazyKey = lazyIndexingKeys[dir];
    if (_lazyKey !== undefined)
      clearTimeout(_lazyKey);

    lazyIndexingKeys[dir] = setTimeout(() => {
      co(refreshIndex([dir], recursive));
    }, 10000);
  }

  function* setupWatchers(dirs, recursive) {
    for (const dir of dirs) {
      const _dir = dir;
      fs.watch(_dir, {
        persistent: true,
        recursive: recursive
      }, (evt, filename) => {
        lazyRefreshIndex(_dir, recursive);
      });
    }
  }

  function addRecentItem(item) {
    const idx = _recentUsedItems.indexOf(item);
    if (idx >= 0)
      _recentUsedItems.splice(idx, 1);

    if (fs.existsSync(item))
      _recentUsedItems.unshift(item);

    _recentUsedItems = _recentUsedItems.slice(0, RECENT_ITEM_COUNT);
    localStorage.setItem('recentUsedItems', _recentUsedItems);
  }

  function updateRecentItems() {
    const aliveItems = [];
    for (const item of _recentUsedItems) {
      if (fs.existsSync(item))
        aliveItems.push(item);
    }
    _recentUsedItems = aliveItems;
  }

  function startup() {
    _recentUsedItems = localStorage.getItemSync('recentUsedItems') || [];
    updateRecentItems();

    co(function* () {
      yield* refreshIndex(recursiveSearchDirs, true);
      yield* refreshIndex(flatSearchDirs, false);
      yield* setupWatchers(recursiveSearchDirs, true);
      yield* setupWatchers(flatSearchDirs, false);
    }).catch((err) => {
      logger.log(err);
      logger.log(err.stack);
    });
  }

  function _fuzzyResultToSearchResult(results) {
    return results.map(x => {
      const path_base64 = new Buffer(x.path).toString('base64');
      return {
        id: x.path,
        title: path.basename(x.path, path.extname(x.path)),
        desc: x.html,
        icon: `icon://${path_base64}`,
        group: 'Files & Folders',
        score: x.score
      };
    });
  }

  function _pathsToSearchResult(paths) {
    return paths.map(x => {
      let result = {
        id: x,
        title: path.win32.basename(x),
        desc: x,
        group: 'Files & Folders (Disk)',
        score: 1
      };
      
      if (fs.lstatSync(x).isDirectory()) {
        result.icon = '#fa fa-folder';
        result.redirect = x;
      } else {
        result.icon = '#fa fa-file-o';
      }
      return result;
    });
  }

  function globSearch(query, res) {
    if (query.search(/[A-z]:[\\\/]/) === 0) {
      // replace back slashes with forward slashes
      let globSearch = query.split('\\').join('/');
      // remove wildcards to stop accidental entire disk scans
      globSearch = globSearch.split('*').join('') + "*"; 
      const options = {
        dot: true, 
        nocase: true,
        mark: true,
        root: globSearch.substr(0,1) + ":\\"
      };

      // remove drive prefix
      globSearch = globSearch.substr(2);

      var find = glob.sync(globSearch, options);
    
      if (find && find.length) {
        if (query.length === 3) {
          res.add(_pathsToSearchResult([query]));
        }
        res.add(_pathsToSearchResult(find.slice(0, 50)));
        return true;
      }
    }
  }
    
  function search(query, res) {
    if (globSearch(query, res))
      return;

    const query_trim = query.replace(' ', '');
    const recentFuzzyResults = util.fuzzy(_recentUsedItems, query_trim).slice(0, 2);
    const defaultFuzzyResults = util.fuzzy(db, query_trim);

    let recentSearchResults = [];
    if (recentFuzzyResults.length > 0) {
      // Update score by usage frequency
      const RATIO_DELTA = (RECENT_ITEM_RATIO_HIGH - RECENT_ITEM_RATIO_LOW);
      const scoredRecentFuzzyResults = recentFuzzyResults.map((x) => {
        const nearIdx = _recentUsedItems.indexOf(x.path);
        const ratio = ((RECENT_ITEM_COUNT - nearIdx) / RECENT_ITEM_COUNT) * RATIO_DELTA + RECENT_ITEM_RATIO_LOW;
        x.score = x.score * ratio;
        return x;
      });
      recentSearchResults = _fuzzyResultToSearchResult(scoredRecentFuzzyResults);
    }
    // Reject if it is duplicated with recent items
    const sanitizedFuzzyResults = lo_reject(defaultFuzzyResults, x => lo_findIndex(recentFuzzyResults, { path: x.path }) >= 0);
    const fileSearchResults = _fuzzyResultToSearchResult(sanitizedFuzzyResults);
    const searchResults = recentSearchResults.concat(fileSearchResults).slice(0, 15);
    res.add(searchResults);
  }

  function execute(id, payload) {
    // Update recent item, and it will be deleted if file don't exists
    addRecentItem(id);

    if (fs.existsSync(id) === false) {
      toast.enqueue('Sorry, Could\'nt Find a File');
      return;
    }

    app.close();
    shell.openItem(id);
  }

  return { startup, search, execute };
};
