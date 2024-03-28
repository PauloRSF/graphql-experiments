const validationError = (message: string) => ({
  kind: "error" as const,
  message,
});

const validationSuccess = <T>(data: T) => ({
  kind: "ok" as const,
  data,
});

export const validatePostCreationBody = (body: unknown) => {
  if (typeof body !== "object" || !body)
    return validationError("No post supplied");

  if (!("id" in body)) return validationError("'id' is required");
  if (typeof body.id !== "number")
    return validationError("'id' must be a number");
  if (body.id <= 0) return validationError("'id' must be a positive integer");

  if (!("title" in body)) return validationError("'title' is required");
  if (typeof body.title !== "string")
    return validationError("'title' must be a string");
  if (body.title === "") return validationError("'title' must not be empty");

  if (!("author_id" in body)) return validationError("'author_id' is required");
  if (typeof body.author_id !== "number")
    return validationError("'author_id' must be a number");
  if (body.author_id <= 0)
    return validationError("'author_id' must be a positive integer");

  if (!("tag_ids" in body)) return validationError("'tag_ids' is required");
  if (!Array.isArray(body.tag_ids))
    return validationError("'tag_ids' must be a list");
  if (!body.tag_ids.every(Number.isInteger))
    return validationError("'tag_ids' must be a list of integers");

  return validationSuccess({
    id: body.id,
    title: body.title,
    author_id: body.author_id,
    tag_ids: body.tag_ids,
  });
};

export const validatePostListQuery = (query: unknown) => {
  let queryObject: { authorIds?: number[] } = {};

  if (typeof query !== "object" || !query) return {};
  if ("author_ids" in query && typeof query.author_ids === "string")
    queryObject.authorIds = query.author_ids.split(",").map(Number);

  return queryObject;
};
