

function getReqParam(map, key, defaultValue) {
    if (map[key] !== undefined && map[key][0] !== undefined) {
        if (typeof defaultValue === 'number') {
            if (isNullOrEmpty(map[key][0]) || map[key][0] === "undefined") {
                return defaultValue;
            }
            return Number(map[key]);
        } else if (typeof defaultValue === 'boolean') {
            return toBoolean(map[key]);
        } else {
            return map[key];
        }
    }
    return defaultValue;
}

function isNullOrEmpty(value) {
    return value === null || value === undefined || value.trim() === '';
}

function toBoolean(value) {
    return value === 'true' || value === '1';
}

 

export const extractGridRequest = (request) => {
    let gridRequest = {};

    let querymap = { ...request.query };
    if (request.method === 'POST' && request.body && request.body.filter) {
        const filters = request.body.filter.split("&");
        for (const e of filters) {
            if (!!e) {
                const values = e.split("=");
                if (!!values && values.length > 1)
                    querymap = { ...querymap, [values[0]]: values[1] };
            }
        }
    }

    gridRequest.rows = getReqParam(querymap, "rows", 10);
    gridRequest.page = getReqParam(querymap, "page", 1);
    gridRequest.sortBy = getReqParam(querymap, "sortBy", "_id");
    gridRequest.sortAsc = getReqParam(querymap, "sortAsc", true);

    delete querymap["rows"];
    delete querymap["page"];
    delete querymap["sortBy"];
    delete querymap["sortAsc"];
    delete querymap["records"];


    gridRequest.filters = {};
    let keyword=null;
    for (let key in querymap) {
        if (querymap.hasOwnProperty(key) && key) {
            let value = querymap[key];
            if (key === 'keyword') {
                keyword = value;
            }
            else if (value.startsWith("in[") && value.endsWith("]")) {
                gridRequest.filters[key] = { $in: value.substring(3, value.length - 1).split(",") };
            } else if (value.startsWith("caseIgnore[") && value.endsWith("]")) {
                gridRequest.filters[key] = { $regex: new RegExp(value.substring(11, value.length - 1), 'i') };
            } else if (value.startsWith("notin[") && value.endsWith("]")) {
                gridRequest.filters[key] = { $nin: value.substring(6, value.length - 1).split(",") };
            } else if (value.startsWith("btw[") && value.endsWith("]")) {
                let [from, to] = value.substring(4, value.length - 1).split(",");
                gridRequest.filters[key] = { $gte: from, $lte: to };
            } else if (value.startsWith("lt[") && value.endsWith("]")) {
                gridRequest.filters[key] = { $lt: value.substring(3, value.length - 1) };
            } else if (value.startsWith("gt[") && value.endsWith("]")) {
                gridRequest.filters[key] = { $gt: value.substring(3, value.length - 1) };
            } else {
                gridRequest.filters[key] = value;
            }
        }
    }
    return gridRequest;
}

export const handleGridRequest = async (request, model) => {
    const gridRequest = extractGridRequest(request);

    const sort = {};
    sort[gridRequest.sortBy] = gridRequest.sortAsc ? 1 : -1;
    const filters = gridRequest.filters;
    let query = model.find(filters).sort(sort);
    if (gridRequest.rows != -1) {
        const skip = (gridRequest.page - 1) * gridRequest.rows;
        const limit = gridRequest.rows;
        query.skip(skip).limit(limit)
    }

    const rows = await query.exec();
    let total = null;
    if (gridRequest.page == 1) {
        total = await model.countDocuments(filters);
    }
    return {
        rows,
        total,
        page: gridRequest.page,
    };
}

