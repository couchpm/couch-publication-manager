const death = require('death')
const read = require('read')
const ttys = require('ttys')
const xtend = require('xtend')

module.exports = function ask (info, last) {
  if (!Array.isArray(info)) {
    info = [info]
  }

  return new Promise(function(resolve, reject) {
    let res = {}
    let current

    function get (info, callback) {
      current = promptify(info.shift())
      read(current, callback)
    }

    function cb (err, data) {
      if (err) reject(err)
      else res[current.name] = data

      if (info.length) {
        get(info, cb)
      }
      else {
        resolve(res)
      }
    }

    get(info, cb)
  })
}

/**
 * Helper function to create prompt line from config
 */
function promptify (config) {
  const line = xtend(config)
  line.input = ttys.stdin
  line.prompt = config.name + ' ->'
  return line
}

/**
 * Close input stream on process exit
 */
death(function () {
  ttys.stdin.end()
})
