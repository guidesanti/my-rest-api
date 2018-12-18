var Response = {

  success (data, meta) {
    return {
      status: 'Success',
      data: data || undefined,
      meta: meta || undefined
    }
  },

  fail (data, meta) {
    return {
      status: 'Fail',
      data: data || undefined,
      meta: meta || undefined
    }
  },
  
  error (errors, meta) {
    return {
      status: 'Error',
      errors: errors || undefined,
      meta: meta || undefined
    }
  },

  toString () {
    return JSON.stringify(this);
  }

}

module.exports = Response;