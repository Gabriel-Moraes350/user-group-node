exports.success = (data) => {
    return {
        'success' : true,
        'datetime': new Date(),
        'data': data
    }
}

exports.error = (data) => {
    return {
        'success': false,
        'date': new Date(),
        'error': data.error || data || '',
        'data':'',
        'message': data.message || ''
    }
}