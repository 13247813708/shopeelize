import { schema } from "./schema/entry";
import { normalize } from "./schema/normalize";

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
console.log(article);
const normalizedData = normalize(originalData, article);
console.log(normalizedData);
