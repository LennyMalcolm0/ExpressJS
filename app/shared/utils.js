function getQueryParameters(req) {
    const { page = 1, limit = 10, filter } = req.query;

    const skip = (page - 1) * limit;

    const filterParameters = {};

    if (filter) {
        const filters = filter.split(",");
        filters.forEach(param => {
            const paramFields = param.split("_");
            const fieldOne = paramFields[0];
            const fieldTwo = paramFields[1];
            const fieldThree = paramFields[2];
            
            filterParameters[fieldOne] = { [`$${fieldTwo}`]: fieldThree };
        });
    }

    return {
        page,
        limit,
        skip,
        filterParameters
    }
}

module.exports = {
    getQueryParameters,
}