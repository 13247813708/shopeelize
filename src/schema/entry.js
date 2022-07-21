class Entity {
    //初始化entity的name，id
    constructor(name, entityParams = {}, entityConfig = {}) {
        const idAttribute = entityConfig.idAttribute || "id";
        this.name = name;
        this.idAttribute = idAttribute;
        this.init(entityParams);
    }
    //初始化entity的其他属性
    init(entityParams) {
        if (!this.schema) {
            this.schema = {};
        }
        Object.keys(entityParams).forEach((item) => {
            this.schema[item] = entityParams[item];
        });
    }
    //获取entity的name
    getName() {
        return this.name;
    }
    //获取初始数据的id，入参为一个对象，返回一个id值
    getId(obj) {
        return obj[this.idAttribute];
    }
}

//暴露出Entity方法
export const schema = {
    Entity,
};