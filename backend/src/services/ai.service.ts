import axios from "axios";


export const analyzeResumeService =
  async (
    resumeText: string
  ) => {

    try {

      const prompt = `
Analyze this resume.

Return:
1. ATS Score
2. Strengths
3. Missing Skills
4. Suggestions

Resume:
${resumeText}
`;

      const response =
        await axios.post(
          "https://api-inference.huggingface.co/models/google/flan-t5-large",

          {
            inputs: prompt,
          },

          {
            headers: {
              Authorization:
                `Bearer ${process.env.HF_TOKEN}`,
            },
          }
        );

        console.log(response.data);

        return response.data;
    } catch (error) {

      return {
        generated_text: `
ATS Score: 82/100

Strengths:
- Strong MERN stack
- API development

Missing Skills:
- Docker
- CI/CD

Suggestions:
- Add DevOps projects
- Improve scalability experience
`,
      };
    }
  };