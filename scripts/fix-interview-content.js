const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

const cleanContent = `<h2>Why the Interview Matters</h2>
<p>If you've been invited for a scholarship interview, congratulations! You're already in the top tier of applicants. The interview is your chance to bring your application to life and show the committee who you really are.</p>
<h2>Before the Interview: Preparation Checklist</h2>
<ul><li>Research the scholarship thoroughly - know their values and mission</li><li>Review your entire application - they will ask about what you wrote</li><li>Prepare 5-7 stories about your leadership and achievements</li><li>Practice with mock interviews (record yourself)</li><li>Prepare thoughtful questions to ask them</li><li>Test your technology for video interviews</li><li>Choose professional attire</li></ul>
<h2>Common Interview Questions and How to Answer</h2>
<h3>About You</h3>
<p><strong>1. Tell us about yourself.</strong><br/>Focus on your academic journey, key achievements, and what drives you. Keep it concise (2-3 minutes).</p>
<p><strong>2. What are your strengths and weaknesses?</strong><br/>Be honest but strategic. For weaknesses, show how you're working to improve.</p>
<p><strong>3. Why do you deserve this scholarship?</strong><br/>Connect your achievements to the scholarship's mission. Show, don't just tell.</p>
<h3>Academic and Career Goals</h3>
<p><strong>4. Why did you choose your field of study?</strong><br/>Share a specific moment or experience that sparked your interest.</p>
<p><strong>5. What are your career plans after graduation?</strong><br/>Be specific about your goals and how your degree will help achieve them.</p>
<p><strong>6. How will you contribute to your home country?</strong><br/>Most scholarships want to know about your impact. Be concrete.</p>
<h3>Leadership and Experience</h3>
<p><strong>7. Tell us about a time you demonstrated leadership.</strong><br/>Use the STAR method: Situation, Task, Action, Result.</p>
<p><strong>8. Describe a challenge you overcame.</strong><br/>Focus on resilience and what you learned.</p>
<p><strong>9. How do you work in a team?</strong><br/>Give a specific example of successful collaboration.</p>
<h3>Why This Scholarship</h3>
<p><strong>10. Why did you choose this scholarship?</strong><br/>Show you've done your research. Mention specific programs or values.</p>
<p><strong>11. How will this scholarship help you achieve your goals?</strong><br/>Connect the scholarship directly to your plans.</p>
<p><strong>12. What other scholarships are you applying for?</strong><br/>Be honest but focus on why this one is your priority.</p>
<h2>Sample Answers for Top Scholarships</h2>
<h3>Chevening Scholarship Interview</h3>
<p><strong>Q: How will you use your UK degree to make a difference in your home country?</strong><br/>"I plan to establish a mentorship program for 100 underprivileged students in my hometown. My UK degree in Education Policy will give me the framework to create an effective curriculum that addresses local needs."</p>
<h3>DAAD Scholarship Interview</h3>
<p><strong>Q: Why Germany and why this specific program?</strong><br/>"Germany is a leader in renewable energy, and TU Berlin's program specifically focuses on solar technology - the exact field I want to work in. Professor Schmidt's research on photovoltaic efficiency directly aligns with my goal of bringing affordable solar solutions to my community."</p>
<h3>Fulbright Interview</h3>
<p><strong>Q: How will you promote cultural exchange?</strong><br/>"I plan to organize weekly cultural events on campus where international and American students can share traditions, food, and perspectives. I also want to start a blog documenting my experience to inspire others from my country to apply."</p>
<h2>Questions to Ask the Interviewer</h2>
<ul><li>"What does a successful scholar look like to this committee?"</li><li>"Are there opportunities for networking with alumni?"</li><li>"What support does the scholarship provide beyond funding?"</li><li>"What do past scholars typically go on to achieve?"</li></ul>
<h2>Video Interview Tips</h2>
<ul><li>Test your camera, microphone, and internet connection beforehand</li><li>Choose a quiet, well-lit location with a neutral background</li><li>Look at the camera, not the screen</li><li>Dress professionally from head to toe</li><li>Have water nearby and turn off phone notifications</li><li>Keep notes nearby but don't rely on them</li></ul>
<h2>After the Interview: Follow-Up</h2>
<ul><li>Send a thank you email within 24 hours</li><li>Mention something specific from the conversation</li><li>Reiterate your interest in the scholarship</li><li>Be patient - decisions take time</li></ul>
<h3>Final Checklist Before Your Interview</h3>
<ul><li>Review your application (know what you wrote!)</li><li>Prepare 5-7 stories (leadership, challenge, teamwork, impact)</li><li>Research the scholarship's mission and values</li><li>Practice answering common questions out loud</li><li>Prepare 2-3 questions to ask them</li><li>Choose professional attire</li><li>Get a good night's sleep</li><li>Arrive early (or log in 10 minutes early for video)</li></ul>`;

async function fix() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    await collection.updateOne(
      { slug: 'scholarship-interview-guide' },
      { $set: { content: cleanContent, updatedAt: new Date() } }
    );
    
    console.log('Content updated with clean HTML');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fix();
