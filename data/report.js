const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const helper = require('../helper');
const reports = mongoCollections.report;

const getAllReports = async() => {
    const ReportCollection = await reports();
    const ReportList = await ReportCollection.find({}).toArray();
    return ReportList;
}

const getReportByID = async(id) => {
    helper.idcheck(id);
    const ReportCollection = await reports();
    const report = await ReportCollection.findOne({_id: ObjectId(id)});
    if (report === null) throw 'No report with that id';
    return report;
}

const AddReport = async(userid, postid, issue) => {
    helper.idcheck(userid);
    helper.idcheck(postid);
    helper.arraycheck(issue);
    const ReportCollection = await reports();
    const FindReport = await ReportCollection.findOne({userid:userid,postid:postid });
    if (FindReport == null){
        let newReport = {
        userid: userid,
        postid: postid,
        issue: issue,
        date: new Date().toLocaleDateString()
    }
    const insertInfo = await ReportCollection.insertOne(newReport);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add Report';
    const newReportid = insertInfo.insertedId;
    const ReportAdded = await getReportByID(newReportid.toString());
    return ReportAdded;
    }
}

const DeleteReport = async(id) => {
    const ReportCollection = await reports();
    const deletionInfo = await ReportCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the report`;
    }
    return "Your report has been successfully deleted!";
}

module.exports = {
    getAllReports,
    getReportByID,
    AddReport,
    DeleteReport
}