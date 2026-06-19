import React, { useState } from "react";
import { Download, FileText, Layers, Briefcase, User, Sparkles, Building2 } from "lucide-react";
import "./Home.css";

export default function HomePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    applyingAsA: "Fresher",
    coverLetterTone: "Formal",
    jobDesc: "",
    currentResume: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("resume"); // 'resume' or 'cover'

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleGenerateData() {
    setIsLoading(true);
    setError("");
    setAiData(null);
    setActiveTab("resume");

    try {
      // Execute API request to local processing service or production relative URL
      const apiUrl = import.meta.env.DEV ? "http://localhost:5000/api/generate-resume" : "/api/generate-resume";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }

      const data = await response.json();
      setAiData(data);
    } catch (err) {
      console.error(err);
      setError("AI rate limit reached. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePrintResume = () => {
    setActiveTab("resume");
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintCover = () => {
    setActiveTab("cover");
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar hide-on-print">
        <div className="navbar-brand">
          <Sparkles size={24} className="text-blue-500" style={{ marginRight: "8px" }} />
          <span className="gradient-text navbar-title">AI Architect</span>
        </div>
        <div className="navbar-actions">
          <div className="navbar-contact">
            <span className="navbar-name">Built by Durga Karthik Panchumarthi</span>
            <span className="navbar-collab">
              For collaboration: <a href="mailto:dkarthik874@gmail.com" className="navbar-email">dkarthik874@gmail.com</a>
            </span>
          </div>
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-hero-nav"
          >
            Built for Digital Heroes
          </a>
        </div>
      </nav>
      <div className="home-container">
        {/* LEFT SIDEBAR: Configuration Form */}
        <aside className="sidebar-config">
          <div className="sidebar-header" style={{ marginBottom: "0.5rem" }}>
            <p>Configure your target role and generate a tailored resume.</p>
          </div>

        <div className="form-group">
          <label htmlFor="companyName">Target Company</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="companyName"
              className="form-control"
              placeholder="e.g. Google, Stripe"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="applyingAsA">Experience Level</label>
            <select name="applyingAsA" className="form-control" value={formData.applyingAsA} onChange={handleInputChange}>
              <option value="Fresher">Entry Level / Fresher</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Experienced">Experienced / Senior</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="coverLetterTone">Tone</label>
            <select name="coverLetterTone" className="form-control" value={formData.coverLetterTone} onChange={handleInputChange}>
              <option value="Formal">Formal</option>
              <option value="Confident">Confident</option>
              <option value="Casual">Modern & Casual</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="jobDesc">Job Description</label>
          <textarea
            name="jobDesc"
            className="form-control"
            placeholder="Paste the job requirements here..."
            value={formData.jobDesc}
            onChange={handleInputChange}
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentResume">Current Resume (Optional)</label>
          <textarea
            name="currentResume"
            className="form-control"
            placeholder="Paste your existing resume raw text. Leave blank to generate from scratch."
            value={formData.currentResume}
            onChange={handleInputChange}
            rows={5}
          />
        </div>

        {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", padding: "0.5rem", background: "#fef2f2", borderRadius: "6px" }}>{error}</div>}

        <button 
          className="btn-primary" 
          onClick={handleGenerateData} 
          disabled={isLoading || (!formData.companyName && !formData.jobDesc)}
        >
          {isLoading ? (
            <><div className="loader"></div> Processing AI...</>
          ) : (
            <><Layers size={18} /> Generate Portfolio</>
          )}
        </button>
      </aside>

      {/* RIGHT SIDEBAR: Live Document Preview */}
      <main className="preview-area">
        {!aiData && !isLoading && (
          <div className="no-data-state">
            <FileText size={64} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>No Resume Generated Yet</h2>
            <p style={{ maxWidth: "300px", marginTop: "0.5rem" }}>Fill out the configuration on the left to watch your premium resume appear here.</p>
          </div>
        )}

        {isLoading && (
          <div className="no-data-state">
            <div className="loader" style={{ width: "40px", height: "40px", borderWidth: "4px", marginBottom: "1rem" }}></div>
            <p>Analyzing job description and tailoring your profile...</p>
          </div>
        )}

        {aiData && (
          <>
            <div className="preview-toolbar">
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Live Preview</span>
                <span className="skill-badge" style={{ background: "#dcfce7", color: "#166534" }}>ATS Score: {aiData.atsScore}/100</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setActiveTab('resume')} 
                  style={{ borderColor: activeTab === 'resume' ? 'var(--accent-color)' : '', color: activeTab === 'resume' ? 'var(--accent-color)' : '' }}
                >
                  <FileText size={16} /> Resume View
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setActiveTab('cover')} 
                  style={{ borderColor: activeTab === 'cover' ? 'var(--accent-color)' : '', color: activeTab === 'cover' ? 'var(--accent-color)' : '' }}
                >
                  <FileText size={16} /> Cover Letter View
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={activeTab === 'resume' ? handlePrintResume : handlePrintCover} 
                  title="Download PDF" 
                  style={{ marginLeft: "0.5rem", background: "var(--accent-color)", color: "white", border: "none" }}
                >
                  <Download size={16} /> Export {activeTab === 'resume' ? 'Resume' : 'Cover Letter'}
                </button>
              </div>
            </div>

            {activeTab === 'resume' && (
              <div id="resume-preview" className="document-wrapper">
              {/* Header */}
              <div style={{ textAlign: "center" }}>
                <h1>{aiData.resume?.name || "[Your Name]"}</h1>
                <div className="doc-contact">{aiData.resume?.contact || "City, State | Phone | Email | LinkedIn"}</div>
              </div>

              {/* Summary */}
              <div className="doc-section">
                <h2>Professional Summary</h2>
                <div className="doc-text">{aiData.resume?.professionalSummary}</div>
              </div>

              {/* Skills */}
              {aiData.resume?.skills && aiData.resume.skills.length > 0 && (
                <div className="doc-section">
                  <h2>Core Competencies</h2>
                  <div className="skills-list">
                    {aiData.resume.skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {aiData.resume?.experience && aiData.resume.experience.length > 0 && (
                <div className="doc-section">
                  <h2>Professional Experience</h2>
                  {aiData.resume.experience.map((exp, idx) => (
                    <div className="job-entry" key={idx}>
                      <div className="job-header">
                        <span className="job-title">{exp.title}</span>
                        <span className="job-dates">{exp.dates}</span>
                      </div>
                      <div className="job-company">{exp.company}</div>
                      <ul className="job-bullets">
                        {exp.achievements?.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {aiData.resume?.projects && aiData.resume.projects.length > 0 && (
                <div className="doc-section">
                  <h2>Projects</h2>
                  {aiData.resume.projects.map((proj, idx) => (
                    <div className="job-entry" key={idx}>
                      <div className="job-header">
                        <span className="job-title">{proj.name}</span>
                        <span className="job-dates">{proj.technologies}</span>
                      </div>
                      <div className="job-company">{proj.description}</div>
                      <ul className="job-bullets">
                        {proj.achievements?.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {aiData.resume?.certifications && aiData.resume.certifications.length > 0 && (
                <div className="doc-section">
                  <h2>Certifications</h2>
                  <ul className="job-bullets" style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                    {aiData.resume.certifications.map((cert, idx) => (
                      <li key={idx} style={{ marginBottom: "0.25rem" }}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Education */}
              {aiData.resume?.education && aiData.resume.education.length > 0 && (
                <div className="doc-section" style={{ borderBottom: "none" }}>
                  <h2>Education</h2>
                  {aiData.resume.education.map((edu, idx) => (
                    <div className="job-entry" key={idx} style={{ marginBottom: "0.5rem" }}>
                      <div className="job-header">
                        <span className="job-title">{edu.degree}</span>
                        <span className="job-dates">{edu.graduationDate}</span>
                      </div>
                      <div className="job-company">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            )}

            {/* Cover letter tab view */}
            {activeTab === 'cover' && (
              <div className="document-wrapper">
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h1>Cover Letter</h1>
                <div className="doc-contact">Tailored for {formData.companyName}</div>
              </div>
              <div className="doc-text" style={{ whiteSpace: "pre-wrap" }}>
                {aiData.coverLetter}
              </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  </div>
  );
}
