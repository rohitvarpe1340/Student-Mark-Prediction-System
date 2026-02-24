const { exec } = require('child_process');
const path = require('path');
const sendEmail = require('../email/sendEmail');
const db = require('../db');

const countMarks = (req, res) => {
    console.log("Payload received:", req.body);
    const { student_name, email, contact, study_hours, attendance, assignment_marks } = req.body;

    if (!student_name || !email || !contact || study_hours === undefined || attendance === undefined || assignment_marks === undefined) {
        return res.status(400).json({ error: "All fields required" });
    }

    const exePath = path.join(__dirname, '../ml_cpp/student.exe');

    exec(`"${exePath}" ${study_hours} ${attendance} ${assignment_marks}`, (err, stdout) => {
        if (err) {
            console.log("C++ ERROR:", err);
            return res.status(500).json({ error: "C++ execution failed" });
        }

        const predictedMarks = parseFloat(stdout);

        const sql = `
            INSERT INTO students
            (student_name, email, contact, study_hours, attendance_marks, assignment_marks, predicted_marks, prediction_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(sql, [student_name, email, contact, study_hours, attendance, assignment_marks, predictedMarks], (err) => {
            if (err) {
                console.log("DB ERROR:", err);
                return res.status(500).json({ error: "Database insert failed" });
            }

            res.json({ predicted_marks: predictedMarks });
        });
    });
};

const getAllStudents = (req, res) => {
    const sql = "SELECT * FROM students ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("DB FETCH ERROR:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(results);
    });
};

const sendStudentHistory = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const sql = "SELECT * FROM students WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'DB fetch failed' });
        if (results.length === 0) return res.status(404).json({ error: 'No records found' });

        let htmlContent = `<h3>Student Marks History</h3>`;
        htmlContent += `<table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>Name</th>
                <th>Study Hours</th>
                <th>Attendance %</th>
                <th>Assignment Marks</th>
                <th>Predicted Marks</th>
            </tr>`;

        results.forEach(r => {
            htmlContent += `<tr>
                <td>${r.student_name}</td>
                <td>${r.study_hours}</td>
                <td>${r.attendance_marks}</td>
                <td>${r.assignment_marks}</td>
                <td>${r.predicted_marks}</td>
            </tr>`;
        });

        htmlContent += `</table>`;

        const sent = await sendEmail(email, 'Your Marks History', htmlContent);
        if (sent) return res.json({ message: 'Email sent successfully' });
        else return res.status(500).json({ error: 'Failed to send email' });
    });
};

module.exports = {
    countMarks,
    getAllStudents,
    sendStudentHistory
};
