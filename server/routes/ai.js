const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Using global fetch instead of node-fetch
// POST /api/ai/recommend
router.post('/recommend', auth, async (req, res) => {
  try {
    const { employees } = req.body;
    
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of employees' });
    }

    const employeeDataStr = JSON.stringify(employees.map(e => ({
      name: e.name,
      department: e.department,
      skills: e.skills,
      performanceScore: e.performanceScore,
      experience: e.experience
    })));

    const prompt = `You are an expert HR Analyst and AI Recommendation Engine. 
Analyze the following employee data:
${employeeDataStr}

For each employee, provide:
1. Promotion Recommendation: Should they be promoted? (Yes/No with a short reason)
2. Training Suggestions: What skills should they learn next based on their department and current skills?
3. AI Feedback Generation: A 2-sentence performance feedback.
Also, provide an overall "Employee Ranking" based on performance scores and experience.

Format the output clearly using Markdown.`;

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterKey) {
      return res.status(500).json({ message: 'OpenRouter API key is missing' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {"role": "user", "content": prompt}
        ],
        max_tokens: 1500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("OpenRouter Error:", data);
        return res.status(response.status).json({ message: "Failed to generate AI recommendation" });
    }

    res.json({ recommendation: data.choices[0].message.content });

  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
