//添加entities内部数据的方法，参数为schema对象和原始数据对象
const addEntities = (entities) => (schema, data) => {
    const schemaName = schema.getName();
    const id = schema.getId(data);
    if (!(schemaName in entities)) {
        entities[schemaName] = {};
    }
    if (entities[schemaName][id]) {
        entities[schemaName][id] = Object.assign(entities[schemaName][id], data);
    } else {
        entities[schemaName][id] = data;
    }
    // console.log(entities)
};

//返回schema对象对应的原始数据的id
const existSchema = (schema, data, isSchema, addEntity) => {
    const currentSchema = schema;
    const currentData = { ...data };
    Object.keys(currentSchema.schema).forEach((item) => {
        //item  为author、comments、commenter
        const currentObj = currentSchema.schema[item];
        const temp = isSchema(currentObj) ? existSchema(currentObj, currentData[item], isSchema, addEntity) : unExistSchema(currentObj, currentData[item], isSchema, addEntity);
        // 即用id表示一个author，得到{author: "1"}这样的数据
        // temp为1、 {total:100, result: ['324']}、2
        //
        currentData[item] = temp;
    });
    addEntity(currentSchema, currentData);
    return currentSchema.getId(data);
};

//如果不存在schema，执行此方法，若是对象，返回替换后的对象；若是数组，返回包含id的数组
const unExistSchema = (schema, data, isSchema, addEntity) => {
    const currentObj = { ...data };
    const currentArr = [];
    const isArr = schema instanceof Array;
    Object.keys(schema).forEach((item) => {
        if (isArr) {
            const currentSchema = schema[item];
            const temp = isSchema(currentSchema) ? existSchema(currentSchema, currentObj[item], isSchema, addEntity) : unExistSchema(currentSchema, currentObj[item], isSchema, addEntity);
            //temp 为324
            currentArr.push(temp);
        } else {
            const currentSchema = schema[item];
            const temp = isSchema(currentSchema) ? existSchema(currentSchema, currentObj[item], isSchema, addEntity) : unExistSchema(currentSchema, currentObj[item], isSchema, addEntity);
            //temp 为['324'],即comments.result = ['324'];
            currentObj[item] = temp;
        }
    });
    return isArr ? currentArr : currentObj;
};

export const normalize = (originalData, schema) => {
    const entities = {};
    const addEntity = addEntities(entities);
    //判断是否是schma结构的对象
    const isSchema = (schema) => {
        return typeof schema.getName !== "undefined";
    };
    //reslut 为返回的id值
    const result = isSchema(schema) ? existSchema(schema, originalData, isSchema, addEntity) : unExistSchema(schema, originalData, isSchema, addEntity);
    return {
        result,
        entities,
    };
};
/* const normalizeData = {
    result: "123",
    entities: {
        "users": {
            "1": { "uid": "1", "name": "Paul" },
            "2": { "uid": "2", "name": "Nicole" }
        },
        "comments": {
            "324": { id: "324", "commenter": "2" }
        }
        "articles": {
            "123": {
                id: "123",
                author: "1",
                title: "My awesome blog post",
                comments: {
                    total: 100,
                    result: ["324"]
                }
            }
        },
    }
} 
*/
