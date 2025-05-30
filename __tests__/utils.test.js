const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns empty object when passed empty array", () => {
    expect(createRef([], "key", "value")).toEqual({});
  });
  test("returns object with single key-value pair when passed array with single object", () => {
    expect(
      createRef([{ key: "keys", value: "values" }], "key", "value")
    ).toEqual({
      keys: "values",
    });
  });
  test("returns object with multiple key-value pair when passed array with multiple objects", () => {
    expect(
      createRef(
        [
          { key: "keys", value: "values" },
          { key: "keys1", value: "values1" },
        ],
        "key",
        "value"
      )
    ).toEqual({
      keys: "values",
      keys1: "values1",
    });
  });
  test("Does not mutate the input array", () => {
    const input = [
      { key: "keys", value: "values" },
      { key: "keys1", value: "values1" },
    ];
    const copyInput = [
      { key: "keys", value: "values" },
      { key: "keys1", value: "values1" },
    ];
    createRef(input, "key", "value");
    expect(input).toStrictEqual(copyInput);
  });
});

describe("formatComments", () => {
  test("returns empty array when passed empty array and object", () => {
    expect(formatComments([], {})).toEqual([]);
  });
  test("returns array of single object containing article_title swapped with article_id", () => {
    const comments = [{ article_title: "book" }];
    const ref = { book: 1 };
    expect(formatComments(comments, ref)).toEqual([{ article_id: 1 }]);
  });
  test("returns array of multiple objects containing article_title swapped with article_id", () => {
    const comments = [{ article_title: "book" }, { article_title: "case" }];
    const ref = { book: 1, case: 2 };
    expect(formatComments(comments, ref)).toEqual([
      { article_id: 1 },
      { article_id: 2 },
    ]);
  });
  test("Does not mutate the input array", () => {
    const comments = [{ article_title: "book" }, { article_title: "case" }];
    const copyComments = [{ article_title: "book" }, { article_title: "case" }];
    const ref = { book: 1, case: 2 };
    formatComments(comments, ref);
    expect(comments).toStrictEqual(copyComments);
  });
});
