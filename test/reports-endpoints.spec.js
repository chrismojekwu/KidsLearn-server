const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

let bearerToken;

describe.only("Reports Endpoints", function () {
  let db;

  const { testUsers, testReports } = helpers.makeReportsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  beforeEach("authorization", () => {
    return supertest(app)
      .post("/api/users")
      .send(testUsers[0])
      .then((createdUserRes) => {
        testUsers[0].id = createdUserRes.body.id;
        // go through the reports, and change their user_id to this one
        return supertest(app)
          .post("/api/auth/login")
          .send(testUsers[0])
          .then((response) => {
            bearerToken = response.body.authToken;
            return true;
          });
      });
    // log that user in
    // set their bearerToken
  });

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/reports`, () => {
    context(`gets a users reports`, () => {
      const expectedReports = testReports.filter((reports) => {
        return reports.user_id === testUsers[0].id;
      });

      it(`responds with correct users reports`, () => {
        return supertest(app)
          .get("/api/reports")
          .set("Authorization", `Bearer ${bearerToken}`)
          .expect(200)
          .expect((res) => {
            return res.body.hasOwnProperty("length");
          });
      });
    });
  });
});
