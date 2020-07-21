const xss = require("xss");
const Treeize = require("treeize");

const ReportsService = {
  getAllReports(db) {
    return db
      .from("kidslearn_reports as kl_reps")
      .select(
        "kl_reps.id",
        "kl_reps.date_created",
        "kl_reps.letters",
        "kl_reps.colors",
        "kl_reps.objects",
        "kl_reps.animals",
        "kl_reps.clothes",
        "kl_reps.comments",
        "kl_reps.user_id"
      );
  },
  getById(db, id) {
    return ReportsService.getAllReports(db).where("kl_reps.user_id", id);
  },
  serializeReports(reports) {
    return reports.map(this.serializeReport);
  },
  serializeReport(report) {
    const reportTree = new Treeize();

    const reportData = reportTree.grow([report]).getData()[0];

    return {
      id: reportData.id,
      date_created: reportData.date_created,
      letters: reportData.letters,
      colors: reportData.colors,
      objects: reportData.objects,
      animals: reportData.animals,
      clothes: reportData.clothes,
      comments: xss(reportData.comments),
      user_id: reportData.user_id,
      child_name: xss(reportData.child_name),
    };
  },
  insertReport(db, newReport) {
    return db
      .insert(newReport)
      .into("kidslearn_reports")
      .returning("*")
      .then(([report]) => report)
      .then((report) => ReportsService.getById(db, report.user_id));
  },
  deleteReport(db, id) {
    return db
      .from("kidslearn_reports")
      .where("kidslearn_reports.id", id)
      .delete();
  },
};

module.exports = ReportsService;
