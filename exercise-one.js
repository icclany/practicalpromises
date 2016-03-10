'use strict';

var Promise = require('bluebird'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    green = exerciseUtils.green,
    red = exerciseUtils.red;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
  problemF: problemF
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem one stanza one (ignore errors)
   *
   */

  // // callback version
  // readFile('poem-one/stanza-01.txt', function (err, stanza) {
  //   console.log('-- A. callback version --');
  //   green(stanza);
  // });

    // promise version
 return new promisifiedReadFile('poem-one/stanza-01.txt')
 .then(function(text) {
  console.log('A promise version');
  green(text);
 });

}

//   // promise version
//  return new Promise(function(pass, fail) {
//   readFile('poem-one/stanza-01.txt', function(err, stanza) {
//     if (err === 'null') {
//       pass(stanza);  
//     } else {
//       fail(err);
//     }
//   })
// }).then(function(text) {
//   console.log('-- A. callback version --');
//   green(text);
//  });
// }

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log poem one stanza two and three, in any order
   *    (ignore errors)
   *
   */

  // callback version
  // readFile('poem-one/stanza-02.txt', function (err, stanza2) {
  //   console.log('-- B. callback version (stanza two) --');
  //   green(stanza2);
  // });
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- B. callback version (stanza three) --');
  //   green(stanza3);
  // });

  return new promisifiedReadFile('poem-one/stanza-02.txt')
 .then(function(text) {
    console.log('A promise version');
    green(text);
    return new promisifiedReadFile('poem-one/stanza-03.txt');
  })
   .then(function(text) {
      console.log('another one');
      green(text);
    });
}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log poem one stanza two and *then* read & log stanza three
   *    log 'done' when both are done
   *    (ignore errors)
   *
   */

  // // callback version
  // readFile('poem-one/stanza-02.txt', function (err, stanza2) {
  //   console.log('-- C. callback version (stanza two) --');
  //   green(stanza2);
  //   readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //     console.log('-- C. callback version (stanza three) --');
  //     green(stanza3);
  //     console.log('-- C. callback version done --');
  //   });
  // });

  // promise version (hint: don't need to nest `then` calls)
  return new promisifiedReadFile('poem-one/stanza-02.txt')
 .then(function(text2) {
    console.log('-- C. promise version (stanza two) --');
    green(text2);
    return new promisifiedReadFile('poem-one/stanza-03.txt');
  })
   .then(function(text) {
      console.log('another one');
      green(text);
      console.log('Promise version DONE')
    });
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log poem one stanza four or an error if it occurs
   *
   */

  // callback version
  // readFile('poem-one/wrong-file-name.txt', function (err, stanza4) {
  //   console.log('-- D. callback version (stanza four) --');
  //   if (err) red(err);
  //   else green(stanza4);
  // });

  return new promisifiedReadFile('poem-one/stanza-04.txt')
 .then(function(text4) {
    console.log('-- C. promise version (stanza four) --');
    green(text4);
  })
  .then(null,function(err) {
    red(err); });
}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. read & log poem one stanza three and *then* read & log stanza four
   *    or log an error if it occurs for either file read
   *
   */

  // callback version
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- E. callback version (stanza three) --');
  //   if (err) return red(err);
  //   green(stanza3);
  //   readFile('poem-one/wrong-file-name.txt', function (err2, stanza4) {
  //     console.log('-- E. callback version (stanza four) --');
  //     if (err2) return red(err2);
  //     green(stanza4);
  //   });
  // });

  // promise version
    return new promisifiedReadFile('poem-one/stanza-03.txt')
 .then(function(text3) {
    console.log('-- E. promise version (stanza three) --');
    green(text3);
    return new promisifiedReadFile('poem-one/stanza-04.txt');
  })
   .then(function(text) {
      console.log('E. callback version (stanza four)');
      green(text);
    })
    .then(null,function(err) {
    red(err); });
}

function problemF () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * F. read & log poem one stanza three and *then* read & log stanza four
   *    or log an error if it occurs for either file read
   *    always log 'done' when everything is done
   *
   */

  // callback version
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- F. callback version (stanza three) --');
  //   if (err) {
  //     red(err);
  //     console.log('-- F. callback version done --');
  //     return;
  //   }
  //   green(stanza3);
  //   readFile('poem-one/wrong-file-name.txt', function (err2, stanza4) {
  //     console.log('-- F. callback version (stanza four) --');
  //     if (err2) red(err2);
  //     else green(stanza4);
  //     console.log('-- F. callback version done --');
  //   });
  // });

   return new promisifiedReadFile('poem-one/stanza-03.txt')
 .then(function(text3) {
    console.log('-- E. promise version (stanza three) --');
    green(text3);
    return new promisifiedReadFile('poem-one/stanza-04.txt');
  })
   .then(function(text) {
      console.log('E. callback version (stanza four)');
      green(text);
      console.log('done');
    })
    .then(null,function(err) {
    red(err);
    console.log('done');
    });
}
