const express = require("express");
const ReportsService = require("./reports-service");
const { requireAuth } = require("../middleware/jwt-auth");

const reportsRouter = express.Router();
const jsonBodyParser = express.json();

reportsRouter.route("/getAllReports").get((req, res, next) => {
  ReportsService.getAllReports(req.app.get("db"))
    .then((reports) => {
      res.status(200).json(ReportsService.serializeReports(reports));
    })
    .catch(next);
});

reportsRouter
  .route("/")
  .all(requireAuth)
  .all(checkForReports)
  .get((req, res, next) => {
    const key = "child_name";
    const value = req.user.child_name;
    for (let i = 0; i < req.reports.length; i++) {
      req.reports[i][key] = value;
    }
    res.status(200).json(ReportsService.serializeReports(req.reports));
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { letters, colors, objects, animals, clothes, comments } = req.body;
    const newReport = { letters, colors, objects, animals, clothes, comments };

    for (const [key, value] of Object.entries(newReport))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    newReport.user_id = req.user.id;

    ReportsService.insertReport(req.app.get("db"), newReport)
      .then((report) => {
        res.status(201).json(report);
      })
      .catch(next);
  });

reportsRouter
  .route("/:rep_id")
  .all(requireAuth)
  .all(checkForReports)
  .get((req, res, next) => {
    const report = req.reports.filter((reports) => {
      return reports.id.toString() === req.params.rep_id;
    });
    res.json(report);
  })
  .delete((req, res, next) => {
    const id = req.params.rep_id;
    ReportsService.deleteReport(req.app.get("db"), id)
      .then((report) => {
        res.status(200).json(report);
      })
      .catch(next);
  });

reportsRouter.route("/share/:rep_id").get((req, res, next) => {
  ReportsService.getAllReports(req.app.get("db"))
    .then((reports) => {
      const report = reports.filter((report) => {
        return report.id.toString() === req.params.rep_id;
      });
      res.status(200).json(report);
    })
    .catch(next);
});

async function checkForReports(req, res, next) {
  console.log("checkForReports");
  try {
    const reports = await ReportsService.getById(
      req.app.get("db"),
      req.user.id
    );

    if (!reports)
      return res.status(404).json({
        error: `There are no reports`,
      });

    req.reports = reports;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = reportsRouter;
