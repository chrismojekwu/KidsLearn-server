const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

let bearerToken;

describe("Reports Endpoints", function () {
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
        let newReports = testReports.map((reports) => {
          return { ...reports, user_id: createdUserRes.body.id };
        });

        helpers.seedReports(db, testUsers.slice(1), newReports);
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
      it(`responds with the correct users reports`, () => {
        return supertest(app)
          .get("/api/reports")
          .set("Authorization", `Bearer ${bearerToken}`)
          .expect(200)
          .expect((res) => {
            return res.body[0].child_name === testReports[0].child_name;
          });
      });
    });
  });

  describe(`GET /api/reports/getAllReports`, () => {
    context(`gets all reports`, () => {
      it(`responds with all users reports`, () => {
        return supertest(app)
          .get("/api/reports/getAllReports")
          .expect(200)
          .expect((res) => {
            return res.body.length === 6;
          });
      });
    });
  });

  describe(`GET /api/reports/share`, () => {
    context(`retrieves a report for sharing`, () => {
      it(`responds with a specified report`, () => {
        return supertest(app)
          .get("/api/reports/share/5")
          .expect(200)
          .expect((res) => {
            return res.body[0].child_name === testReports[4].child_name;
          });
      });
    });
  });

  describe(`POST /api/reports`, () => {
    context(`Given full database it posts a report`, () => {
      const testPostReport = {
        letters: 1,
        colors: 2,
        objects: 3,
        animals: 4,
        clothes: 50,
        comments: "test report post",
      };
      it(`successfully posts a report`, () => {
        return supertest(app)
          .post("/api/reports")
          .set("Authorization", `Bearer ${bearerToken}`)
          .send(testPostReport)
          .expect(201)
          .expect((res) => {
            const postedReport = res.body.pop();
            return postedReport.comments === testPostReport.comments;
          });
      });
    });
  });

  describe(`GET /api/reports/:rep_id`, () => {
    context(`Given a full daatabase it retrieves a specified report`, () => {
      it(`retrieves specified report`, () => {
        return supertest(app)
          .get("/api/reports/5")
          .set("Authorization", `Bearer ${bearerToken}`)
          .expect(200)
          .expect((res) => {
            res.body[0].child_name === testReports[2].child_name;
          });
      });
    });
  });

  describe(`DELETE /api/reports/:rep_id`, () => {
    context(`Given full database it deletes a report`, () => {
      it(`successfully deletes a specified report`, () => {
        return supertest(app)
          .delete("/api/reports/6")
          .set("Authorization", `Bearer ${bearerToken}`)
          .expect(200)
          .then((res) => {
            return supertest(app)
              .get("/api/reports")
              .set("Authorization", `Bearer ${bearerToken}`)
              .expect(200)
              .expect((res2) => {
                res2.body.length === 5;
              });
          });
      });
    });
  });
});
