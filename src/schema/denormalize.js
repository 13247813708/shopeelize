
//返回替换后的对象，根据id找到对应的对象或直接返回该对象
const getEntities = (entities) => {
    return (objectOrId, schema) => {
        const schemaName = schema.getName();
        if (typeof objectOrId === "object") {
            return objectOrId;
        }
        return entities[schemaName][objectOrId]; // 取出里面的对象
    };
};

/*
返回反解后得到的对象
schema参数为articles 或者 users 或者 comments 
id 的值为 ‘123’， ‘1’， ‘324','2',
'{ id: '324', commenter: { uid: '2', name: 'Nicole' } }'
{ uid: '2', name: 'Nicole' }
*/
const ExistEntitiy = (schema, id, unflatten, store, getEntity) => {
    const entity = getEntity(id, schema);
    if (!store[schema.getName()]) {
        store[schema.getName()] = {};
    }
    if (!store[schema.getName()][id]) {
        const entityCopy = { ...entity };
        Object.keys(schema.schema).forEach((key) => {
            // key 为 author和 comments   ,还有commenter
            if (Object.prototype.hasOwnProperty.call(entityCopy, key)) {
                // 内部的schema值,也就是users 和{result:[comment]}
                const currentSchema = schema.schema[key];

                entityCopy[key] = unflatten(entityCopy[key], currentSchema);
                // console.log(entityCopy[key]);
            }
        });
        store[schema.getName()][id] = entityCopy;
        // console.log(JSON.stringify(store))
    }
    //返回反解后得到的对象，也就是store[articles]['123']
    // console.log(store[schema.getName()][id])
    return store[schema.getName()][id];
};


//参数result为数组或者对象，如 {total:100,result:['324]} 和 ['324'] ,
//参数schema 为 {result:[{comments}]}   和     [{comments}]
//返回反解后的数组或者对象，数组为形式为[{...}]，对象为反解后得到的对象
const unExistEntity = (schema, result, unflatten) => {
    const currentObj = { ...result };
    const currentArr = [];
    const flag = schema instanceof Array;
    Object.keys(schema).forEach((key) => {
        // console.log(key) --- schema为对象时，key为result； schema为数组时，key为0
        if (flag) {
            if (currentObj[key]) {
                currentObj[key] = unflatten(currentObj[key], schema[key]);
                //currObj[0] =  [{"id":"324","commenter":{"uid":"2","name":"Nicole"}}]
            }
            currentArr.push(unflatten(currentObj[key], schema[key]));
        } else {
            if (currentObj[key]) {
                currentObj[key] = unflatten(currentObj[key], schema[key]);
                // currentObj.result = [{"id":"324","commenter":{"uid":"2","name":"Nicole"}}]
            }
        }
    });
    if (flag) {
        // currentArr = [ { id: '324', commenter: { uid: '2', name: 'Nicole' } } ]
        return currentArr;
    } else {
        // currentObj = { total: 100, result: [ { id: '324', commenter: [Object] } ] }
        return currentObj;
    }
};


export const denormalize = (id, schema, entities) => {
    // 获取entity实例
    const getEntity = getEntities(entities);
    // 还原数据的对象
    const store = {};
    //返回反解后的对象，参数为id和schema
    const unflatten = (objectOrId, schema) => {
        //判断传进来的schema是否包含name属性
        if (typeof schema.getName === "undefined") {
            return unExistEntity(schema, objectOrId, unflatten);
        } else {
            return ExistEntitiy(schema, objectOrId, unflatten, store, getEntity);
        }
    };
    return unflatten(id, schema);
};
/* const article = {
    name: "articles",
    idAttribute: "id",
    schema: {
        author: { name: "users", idAttribute: "uid", schema: {} },
        comments: {
            result: [
                {
                    name: "comments",
                    idAttribute: "id",
                    schema: {
                        commenter: { name: "users", idAttribute: "uid", schema: {} },
                    },
                },
            ],
        },
    },
}; */
