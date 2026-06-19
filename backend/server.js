import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables strictly from this backend/ folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-resume', async (req, res) => {
  const { companyName, applyingAsA, jobDesc, currentResume, coverLetterTone } = req.body;

  const prompt = `You are a professional career coach and resume optimization expert.
Your task is to generate both a complete, highly structured Markdown Cover Letter AND a perfectly segmented Resume specifically styled for JSON output so that a frontend application can render it beautifully.

CRITICAL INSTRUCTIONS:
1. IF 'Current Resume' contains pasted text, you MUST use ONLY the actual jobs, projects, and degrees mentioned. Do NOT invent new career history. However, you MUST aggressively rewrite, enhance, and optimize the descriptions and achievements of those existing roles to be highly ATS-friendly and perfectly tailored to the 'Job Description'. Maximize impact using strong action verbs and professional formatting based on the provided data. If a section is missing from the source text, explicitly return an empty array [] for that section.
2. IF 'Current Resume' says "None provided", you must generate a completely synthetic, highly optimized draft resume from scratch based explicitly on the 'Job Description'.
3. KEYWORD INJECTION: Extract the mandatory hard skills and core requirements from the 'Job Description' and organically weave them into the Professional Summary and Experience bullet points.
4. METRICS & FORMATTING: Structure achievement bullet points using the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]"). If the user provided numbers or metrics, highlight them prominently.
5. SKILLS EXTRACTION: Populate the 'skills' JSON array primarily with keywords that natively intersect between the 'Current Resume' and the 'Job Description' to guarantee a high ATS match score.
6. ACTION VERB DIVERSITY: Ensure absolutely no two bullet points start with the exact same action verb.
7. TONE AND CLICHÉS: Strictly avoid cliché buzzwords like 'hardworking', 'passionate', or 'team player'. Replace them with concrete evidence of results.
8. JARGON TRANSLATION: If the 'Current Resume' uses obscure internal company jargon, translate it into recognized standard industry terminology.
9. HARD ONE-PAGE LIMIT: By default, the Resume MUST STRICTLY fit on one single page. You MUST mathematically enforce this by limiting every job/project to a MAXIMUM of 2 bullet points, and capping the total number of roles/projects to the 3 most relevant ones. ONLY break this rule and generate a 2-page resume if the user explicitly writes a command like "make this 2 pages" in their text.
10. COMPREHENSIVE COVER LETTER: You MUST write a highly persuasive, full 3-4 paragraph cover letter (minimum 250 words) that proves exactly how the candidate's background solves the core problems in the target 'Job Description'. Do not write a short summary. Make it detailed and impactful.
11. ATS MACHINE-READABILITY: Avoid using complex text formatting, weird unicode characters, or emojis. Keep all text plain and universally parseable.

Given the following details:
Company Name: ${companyName}
Experience Level: ${applyingAsA}
Job Description: ${jobDesc}
Current Resume: ${currentResume || 'None provided. Generate a draft from scratch.'}
Preferred Tone: ${coverLetterTone}

You MUST return a pure JSON object in the exact structure below. Do not wrap it in markdown blockticks like \`\`\`json. Return only the parsable JSON.
{
  "coverLetter": "The professionally tailored cover letter written here in markdown or plain text with paragraphs.",
  "resume": {
    "name": "Candidate Name (Make one up based on resume if needed, or put [Your Name])",
    "contact": "[City, State] | [Phone] | [Email]",
    "professionalSummary": "A powerful 3-sentence summary highlighting core competencies...",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
    "experience": [
      {
        "title": "Job Title",
        "company": "Company Name",
        "dates": "Start Date - End Date",
        "achievements": [
          "Action-oriented bullet point 1 with metrics.",
          "Action-oriented bullet point 2.",
          "Action-oriented bullet point 3."
        ]
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Short overall description",
        "technologies": "React, Node, etc.",
        "achievements": ["Bullet point 1", "Bullet point 2"]
      }
    ],
    "certifications": ["Certification 1", "Certification 2"],
    "education": [
      {
        "degree": "Degree Name",
        "institution": "University/College Name",
        "graduationDate": "Grad Date"
      }
    ]
  },
  "atsScore": "A number out of 100",
  "feedback": "1 short paragraph explaining ATS score and what to fix"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" } // Enforce JSON
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error! status: ${response.status}`);
    }

    const data = await response.json();
    const resultJson = JSON.parse(data.choices[0].message.content);
    res.json(resultJson);

  } catch (error) {
    console.error("Error communicating with Groq:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

// Serve static files in production (Render)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Catch-all route to serve the React app (Regex ensures Express 5 compatibility)
app.get(/^.*$/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
}

export default app;
