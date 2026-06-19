# 🤖 AI Resume Builder — Career Architect

**Live Demo**: [https://digital-heroes-ai-resume-builder.vercel.app](https://digital-heroes-ai-resume-builder.vercel.app)

An intelligent, full-stack application designed to streamline the career application process. This platform analyzes job descriptions against a user's base capabilities to generate professionally tailored, ATS-optimized resumes and cover letters in real-time.

## 🚀 Overview of Approach

Building a reliable AI application requires a strict separation of concerns and robust data handling. 

1. **Security First**: All interactions with the Large Language Model (LLM) happen strictly within an isolated Node.js/Express backend. This ensures that sensitive API keys are never exposed to the client browser.
2. **Deterministic Outputs**: Instead of relying on raw markdown streams which can break UI layouts, the backend relies on strict JSON schema enforcement to force the LLM to return valid JSON. This allows the React frontend to reliably map complex arrays (like Projects and Certifications) into precise HTML components.
3. **Advanced LLM Prompt Engineering**: The Express server utilizes an 11-point critical instruction architecture (including Google XYZ formatting enforcement, dynamic ATS keyword injection, action-verb diversity checking, and strict hallucination overrides) to act as an automated Senior Career Coach rather than a basic text summarizer.
4. **No-Dependency Print Layouts**: Rather than using heavy, slow PDF-generation libraries, the application leverages native CSS `@media print` directives to cleanly strip away the UI controls and export a pristine A4 document directly utilizing the browser's native print engine.

## ✨ Key Features

- **Instant ATS-Optimized Resumes**  
  Paste your existing, messy resume and the job description you're aiming for. The platform instantly rewrites, restructures, and formats your experience to highlight the perfect keywords naturally, helping you beat automated screening software.

- **Real-Time ATS Match Scoring**  
  Get immediate, actionable feedback on how well your newly generated resume matches the specific job description with a live, integrated ATS score out of 100 before you even apply.

- **Action-Driven Impact (Google XYZ Formula)**  
  The builder automatically restructures your achievements using the professional Google XYZ formula ("Accomplished X as measured by Y, by doing Z"). It actively eliminates cliché buzzwords and replaces them with strong, metric-driven action verbs.

- **Smart Cover Letter Creator**  
  Automatically generate a compelling, multi-paragraph cover letter tailored precisely to the target company and role. You can dynamically adjust the tone (Formal, Confident, or Modern & Casual) to perfectly match the company culture.

- **One-Click Pristine PDF Export**  
  Once you are happy with your generated portfolio in the live preview, hit export to instantly download a perfectly formatted, pixel-perfect A4 PDF. The export automatically strips away all UI menus, leaving you with a clean document ready to submit.

- **Seamless Mobile Experience**  
  Work on your resume from anywhere. The application seamlessly adapts from a powerful side-by-side configuration view on desktop to an elegant, thumb-friendly vertical scroll on your smartphone or tablet.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Custom Design System, Glassmorphism, Responsive Media Queries)
- **Backend**: Node.js, Express.js
- **Tooling**: Concurrently (Single-command Dev Server Orchestration)
- **AI Integration**: Groq API (Llama 3 Model)

## 💻 Local Development Setup

To run this project locally, ensure you have Node.js installed.

1. **Install Dependencies**
   Navigate to the root directory and install all required modules:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Navigate into the `backend/` directory and create a hidden `.env` file containing your AI API key:
   ```text
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Boot Up the Server**
   Return to the root folder of the project and start the orchestration script. This runs both the Node.js backend and the React frontend simultaneously:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to the local server, typically `http://localhost:5173`.

## 🚀 Deployment (Vercel)

This application is configured for a unified deployment on Vercel. Both the Express backend (as Vercel Serverless Functions) and the React frontend are hosted together under the same domain.

### Deploying via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   Run the following command in the root directory:
   ```bash
   vercel
   ```
   Follow the prompts to link the project and deploy the preview build.

3. **Configure Environment Variables**
   Add your Groq API key to your Vercel project:
   ```bash
   vercel env add GROQ_API_KEY
   ```

4. **Promote to Production**
   ```bash
   vercel --prod
   ```

### Deploying via Vercel Dashboard (Git Integration)

1. Push your code (including `vercel.json`) to your Git repository (GitHub, GitLab, or Bitbucket).
2. Import the repository into your Vercel Dashboard.
3. In the project configuration page, add the following under **Environment Variables**:
   * **Key**: `GROQ_API_KEY`
   * **Value**: *your_groq_api_key*
4. Click **Deploy**. Vercel will automatically build and host the application.

---

**Built by**: Durga Karthik Panchumarthi | [dkarthik874@gmail.com](mailto:dkarthik874@gmail.com)  
**Built for**: [Digital Heroes](https://digitalheroesco.com)
