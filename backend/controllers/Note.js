const express = require("express");
const bcrypt = require("bcrypt");
const Note = require("../models/Note");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
    }
});

const createNote = async (req, res) => {
    try {
        const { text, password, readOnce, expireHours, email } = req.body;

        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const expiresAt = new Date(Date.now() + (expireHours || 24) * 60 * 60 * 1000);

        const note = new Note({
            text,
            password: hashedPassword,
            readOnce: readOnce !== undefined ? readOnce : true,
            expiresAt,
            email: email || null
        });

        await note.save();

        if (email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your Private Note is Ready",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Private Note is Ready</title>
                <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f7;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #1f2937;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    font-size: 22px;
                    font-weight: bold;
                }
                .content {
                    padding: 30px 20px;
                    color: #111827;
                    line-height: 1.6;
                }
                .content h1 {
                    font-size: 20px;
                    margin-bottom: 16px;
                }
                .link-button {
                    display: inline-block;
                    background-color: #1f2937;
                    color: #ffffff;
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                }
                .link-button:hover {
                    background-color: #374151;
                }
                .footer {
                    background-color: #f4f4f7;
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                    color: #6b7280;
                }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                    Private Note Ready
                    </div>
                    <div class="content">
                    <h1>Your private note is ready!</h1>
                    <p>Click the button below to open it:</p>
                    <a href="https://toprak.xyz'}/note/${note._id}" class="link-button">Open Note</a>
                    <p style="margin-top:15px; color:#6b7280; font-size:14px;">
                        If you didn't create this note, ignore this email.
                    </p>
                    </div>
                    <div class="footer">
                    &copy; ${new Date().getFullYear()} Private Notes. All rights reserved.
                    </div>
                </div>
                </body>
                </html>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) console.log("Email send error:", err);
                else console.log("Email sent: " + info.response);
            });
        }

        res.json({
            message: "Note created successfully!",
            link: `/note/${note._id}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const readNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const { text } = req.body;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found or already deleted." });

        if (note.password) {
            if (!password) return res.status(401).json({ message: "Password Required." });

            const isMatch = await bcrypt.compare(password, note.password);
            if (!isMatch) return res.status(403).json({ message: "Invalid password." });
        }

        const noteText = note.text;

        if (note.readOnce) {
            await note.deleteOne();
        } else {
            note.hasRead = true;
            await note.save();
        }

        if (note.email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: note.email,
                subject: "Your Note Has Been Read",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Repaste.it | Note Read Notification</title>
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f7;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    overflow: hidden;
                  }
                  .header {
                    background-color: #1f2937;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    font-size: 22px;
                    font-weight: bold;
                  }
                  .content {
                    padding: 30px 20px;
                    color: #111827;
                    line-height: 1.6;
                  }
                  .content h1 {
                    font-size: 20px;
                    margin-bottom: 16px;
                  }
                  .content p {
                    margin-bottom: 12px;
                  }
                  .note-id {
                    display: inline-block;
                    background-color: #facc15;
                    color: #111827;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-weight: bold;
                    text-decoration: none;
                  }
                  .footer {
                    background-color: #f4f4f7;
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                    color: #6b7280;
                  }
                  a.button {
                    display: inline-block;
                    background-color: #1f2937;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                  }
                  a.button:hover {
                    background-color: #374151;
                  }
                </style>
                </head>
                <body>
<div class="container">
  <div class="header">
    Private Note Notification
  </div>
  <div class="content">
    <h1>Your note has been read!</h1>
    <p>
      Your note starting with 
      "<strong>${noteText.slice(0, 15)}${noteText.length > 15 ? '...' : ''}</strong>" 
      has just been read.
    </p>
    <p class="note-id">Note ID: ${note._id}</p>
    <p>If this wasn’t you, make sure your notes are secured!</p>
    <a href="${process.env.FRONTEND_URL}/note/${note._id}" class="button">View Note</a>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} Private Notes. All rights reserved.
  </div>
</div>

                </body>
                </html>
                `                            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) console.log("Email send error:", err);
                else console.log("Read notification sent: " + info.response);
            });
        }

        res.json({ text: noteText });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createNote, readNote };