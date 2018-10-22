exports.success = (data) => {
    return {
        'success' : true,
        'datetime': new Date(),
        'data': data
    }
}

exports.error = (errors) => {
    return {
        'success': false,
        'date': new Date(),
        'errors':errors,
        'data':''
    }
}