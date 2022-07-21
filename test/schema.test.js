import { schema } from "../src/schema/entry";
import { normalize } from "../src/schema/normalize";
import { denormalize } from "../src/schema/denormalize";
// 原始数据
const originalData = {
    id: "123",
    author: {
        uid: "1",
        name: "Paul",
    },
    title: "My awesome blog post",
    comments: {
        total: 100,
        result: [
            {
                id: "324",
                commenter: {
                    uid: "2",
                    name: "Nicole",
                },
            },
        ],
    },
};
// 期望数据
const expectData = {
    entities: {
        articles: {
            123: {
                id: "123",
                author: "1",
                title: "My awesome blog post",
                comments: {
                    total: 100,
                    result: ["324"],
                },
            },
        },
        users: {
            1: { uid: "1", name: "Paul" },
            2: { uid: "2", name: "Nicole" },
        },
        comments: {
            324: { id: "324", commenter: "2" },
        },
    },
    result: "123",
};
describe("first data", () => {
    // Define a users schema
    const user = new schema.Entity(
        "users",
        {},
        {
            idAttribute: "uid",
        }
    );
    // Define your comments schema
    const comment = new schema.Entity("comments", {
        commenter: user,
    });
    // Define your article
    const article = new schema.Entity("articles", {
        author: user,
        comments: {
            result: [comment],
        },
    });
    const normalizedData = normalize(originalData, article);
    test("test originalData to normalizedData", () => {
        expect(normalizedData).toEqual(expectData);
    });
    test("test normalizedData to originalData", () => {
        const { result, entities } = normalizedData;
        const denormalizedData = denormalize(result, article, entities);
        expect(denormalizedData).toEqual(originalData);
    });
});
