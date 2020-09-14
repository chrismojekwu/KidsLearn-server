const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 5,
      user_name: "test-user-1",
      child_name: "Test child 1",
      email: "TU1",
      password: "T#st1234!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: new Date("2029-01-23T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      child_name: "Test child 2",
      email: "TU2",
      password: "T#st1234!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: new Date("2029-01-23T16:28:32.615Z"),
    },
    {
      id: 3,
      user_name: "test-user-3",
      child_name: "Test child 3",
      email: "TU3",
      password: "T#st1234!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: new Date("2029-01-23T16:28:32.615Z"),
    },
    {
      id: 4,
      user_name: "test-user-4",
      child_name: "Test child 4",
      email: "TU4",
      password: "T#st1234!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: new Date("2029-01-23T16:28:32.615Z"),
    },
  ];
}

function makeReportsArray(users) {
  return [
    {
      id: 1,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 1",
      user_id: users[0].id,
    },
    {
      id: 2,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 2",
      user_id: users[1].id,
    },
    {
      id: 3,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 2",
      user_id: users[2].id,
    },
    {
      id: 4,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 3",
      user_id: users[3].id,
    },
    {
      id: 5,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 4",
      user_id: users[2].id,
    },
    {
      id: 6,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      letters: 2,
      colors: 3,
      objects: 4,
      animals: 5,
      clothes: 6,
      comments: " Test comment 5",
      user_id: users[0].id,
    },
  ];
}

function makeExpectedReport(reports, reportid) {
  return reports.filter((report) => report.id === reportid);
}

function makeMaliciousReport(user) {
  return {
    id: 119,
    date_created: new Date(),
    letters: 4,
    colors: 5,
    objects: 4,
    animals: 7,
    clothes: 6,
    comments: 'HELLOOOOOOOOO <script>alert("WHOA KENNY!");</script>',
    user_id: user.id,
  };
}

function makeReportsFixtures() {
  const testUsers = makeUsersArray();
  const testReports = makeReportsArray(testUsers);
  return { testUsers, testReports };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        kidslearn_users,
        kidslearn_reports
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE kidslearn_reports_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE kidslearn_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('kidslearn_users_id_seq', 0)`),
          trx.raw(`SELECT setval('kidslearn_reports_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db
    .into("kidslearn_users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('kidslearn_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function seedReports(db, users, reports) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("kidslearn_reports").insert(reports);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('kidslearn_reports_id_seq', ?)`, [
      reports[reports.length - 1].id,
    ]);
  });
}

function seedMaliciousReport(db, user, report) {
  return seedUsers(db, [user]).then(() =>
    db.into("kidslearn_reports").insert([report])
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeReportsArray,
  makeExpectedReport,
  makeMaliciousReport,
  makeReportsFixtures,
  cleanTables,
  seedUsers,
  seedReports,
  seedMaliciousReport,
  makeAuthHeader,
};
