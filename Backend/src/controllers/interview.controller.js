const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumeHtml } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file) {
            try {
                const parsed = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
                const rawText = await parsed.getText()
                resumeText = typeof rawText === "string" ? rawText : (rawText?.text || "")
            } catch (parseError) {
                console.error("PDF Parsing failed:", parseError)
                return res.status(400).json({ 
                    message: "Failed to parse PDF resume. Make sure it is a valid, uncorrupted PDF." 
                })
            }
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({ 
                message: "Job description is required." 
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ 
                message: "Either a resume file or a self-description is required." 
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error in generateInterViewReportController:", err)
        res.status(500).json({
            message: "An error occurred while generating the interview report.",
            error: err.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const htmlContent = await generateResumeHtml({ resume, jobDescription, selfDescription })

        res.status(200).json({
            message: "Resume HTML generated successfully.",
            html: htmlContent
        })
    } catch (err) {
        console.error("Error in generateResumePdfController:", err)
        res.status(500).json({
            message: "Failed to generate resume HTML: " + err.message
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }