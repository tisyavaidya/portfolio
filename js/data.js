/* ==========================================================================
   All the site's content lives here. Edit this file to update the website.
   ========================================================================== */

window.SITE = {
  name: "Tisya Vaidya",
  status: "Open to data science and ML internships",
  email: "vaidyatisya19@gmail.com",
  linkedin: "https://www.linkedin.com/in/tisya-vaidya/",
  github: "https://github.com/tisyavaidya",
  resume: "assets/Tisya_Vaidya_Resume.pdf",
  location: "Uppsala, Sweden",

  /* ---------------------------------------------------------------- Work */
  // kind: "work" | "research" | "teaching"  (sets the colour in the timeline)
  // start / end: "YYYY-MM"
  experience: [
    {
      id: "digital-ipsum", kind: "work",
      role: "Data Science Intern", org: "Digital Ipsum Pvt. Ltd.", place: "Remote",
      start: "2026-06", end: "2026-08", dates: "Jun – Aug 2026",
      points: [
        "Designed the matching logic for a therapist–client matching system and integrated personalised recommendations into the company website.",
        "Built a model to predict digital marketing campaign ROI, covering preprocessing, exploratory analysis, feature selection and evaluation."
      ]
    },
    {
      id: "avt", kind: "research", short: "Autonomous vehicles researcher",
      role: "Applied Researcher, Autonomous Vehicles", org: "Penn State Autonomous Vehicle Team", place: "University Park, USA",
      start: "2025-01", end: "2025-05", dates: "Jan – May 2025",
      points: [
        "Researched stereo visual odometry for navigation without GNSS.",
        "Wrote feature extraction, pose estimation and trajectory reconstruction with OpenCV, Python and ROS.",
        "Built visual odometry pipelines with FLIR Blackfly S stereo cameras for depth mapping and trajectory reconstruction."
      ]
    },
    {
      id: "rls", kind: "research",
      role: "Research Assistant", org: "Penn State, with Dr. Nilanjan Ray Chaudhuri", place: "University Park, USA",
      start: "2024-05", end: "2024-08", dates: "May – Aug 2024",
      points: [
        "Worked on making Recursive Least Squares models in MATLAB more robust.",
        "Tested methods to reduce the impact of outliers, so the model's estimates stayed accurate and reliable."
      ]
    },
    {
      id: "ltim", kind: "work",
      role: "Generative AI Intern", org: "LTIMindtree", place: "Mumbai, India",
      start: "2024-05", end: "2024-07", dates: "May – Jul 2024",
      points: [
        "Implemented image generation with models like DALL·E and Gemini, producing high-resolution 3D images.",
        "Helped build and test instruction-based image editing, working from research papers.",
        "Implemented background removal with Microsoft Azure AI services.",
        "Automated product data collection from eBay with Scrapy, BeautifulSoup and Selenium."
      ]
    },
    {
      id: "tcs", kind: "work",
      role: "Data Science Intern", org: "Tata Consultancy Services", place: "Mumbai, India",
      start: "2023-06", end: "2023-07", dates: "Jun – Jul 2023",
      points: [
        "Turned raw client data in Excel into clean, accessible data with BW/4HANA and Google Looker.",
        "Built a front end on SAP AppGyver and integrated it with the back end."
      ]
    },
    {
      id: "la-221", kind: "teaching", short: "Learning Assistant, CMPSC 221",
      role: "Learning Assistant, CMPSC 221", org: "Penn State", place: "University Park, USA",
      start: "2023-08", end: "2025-05", dates: "Aug 2023 – May 2025",
      points: [
        "Supported students in Object-Oriented Programming with Web-Based Applications.",
        "Refined course content with the professor and TAs, and graded exams, assignments and projects."
      ]
    },
    {
      id: "wie", kind: "teaching", short: "Facilitator, Women in Engineering",
      role: "Facilitator, Women in Engineering Program", org: "Penn State", place: "University Park, USA",
      start: "2022-08", end: "2025-05", dates: "Aug 2022 – May 2025",
      points: [
        "Wrote and taught lesson plans for CMPSC 131 (Python).",
        "Adapted exercises and assessments to help students prepare for exams."
      ]
    },
    {
      id: "la-trig", kind: "teaching", short: "Learning Assistant, Trigonometry",
      role: "Learning Assistant, Trigonometry and Analytic Geometry", org: "Penn State Eberly College of Science", place: "University Park, USA",
      start: "2024-08", end: "2024-12", dates: "Aug – Dec 2024",
      points: ["Ran tutoring sessions and gave problem-solving support."]
    },
    {
      id: "la-calc", kind: "teaching", short: "Learning Assistant, Calculus 2",
      role: "Learning Assistant, Calculus 2", org: "Penn State Eberly College of Science", place: "University Park, USA",
      start: "2023-01", end: "2023-05", dates: "Jan – May 2023",
      points: ["Tutored students, using tools like Minitab and Wolfram Alpha."]
    }
  ],

  education: [
    {
      school: "Uppsala University", place: "Uppsala, Sweden",
      degree: "M.S. in Data Science, Machine Learning and Statistics", dates: "Aug 2026 – Jun 2028"
    },
    {
      school: "The Pennsylvania State University", place: "University Park, USA",
      degree: "B.S. in Computational Data Science, minors in Mathematics and Statistics", dates: "Aug 2021 – May 2025"
    }
  ],

  skills: [
    ["Languages", "Python, SQL, R, Java, MATLAB"],
    ["Machine learning", "scikit-learn, BERT and RoBERTa fine-tuning, ensembles, regression, classification"],
    ["Data", "NumPy, Pandas, Matplotlib, Seaborn, web scraping"],
    ["Vision and robotics", "OpenCV, ROS, stereo visual odometry"],
    ["Analytics", "Tableau, Power BI, Excel"]
  ],

  /* ------------------------------------------------------------ Projects */
  // category: "ml" | "analytics" | "software"
  // chart: the little picture on the card (bars, line, scatter, heatmap, pie, hist, grid, blocks, map, dashboard, curve)
  // link: GitHub URL, or "" if there isn't a public repo
  projects: [
    {
      id: "hate-speech", category: "ml", chart: "heatmap", featured: true,
      title: "Hate speech detection with multi-model ensembles",
      stack: ["Python", "BERT", "RoBERTa", "Ensembles"],
      link: "https://github.com/tisyavaidya/DS340W--Project",
      summary: "Fine-tuned transformers combined in an ensemble to catch hate speech on an imbalanced dataset.",
      metrics: [["93%", "accuracy"], ["0.79", "macro F1, from 0.70"], ["+15%", "on functional tests"]],
      body: [
        "Built on prior work including the HateCheck framework to make hate speech detection more robust on the imbalanced Davidson 2017 dataset.",
        "Fine-tuned BERT and RoBERTa to capture context, then combined their predictions with probability averaging and majority voting.",
        "Designed a preprocessing pipeline with negation handling, lemmatisation and contextual text normalisation."
      ],
      results: [
        "Accuracy 93%, against 90% for logistic regression and 92% for standalone transformers",
        "Macro F1 up from 0.70 to 0.79; hate speech precision up from 44% to 56%",
        "Non-hateful profanity detection from 72% to 85%",
        "Negated hate speech from 68% to 83%; reclaimed slurs from 65% to 82%"
      ]
    },
    {
      id: "loanlens", category: "ml", chart: "bars",
      title: "LoanLens: loan approval prediction",
      stack: ["Python", "scikit-learn", "Pandas", "Seaborn"],
      link: "https://github.com/tisyavaidya/Loan-Approval-Prediction-Model",
      summary: "Compared five classifiers on 500+ loan applications, reaching about 77% accuracy.",
      body: [
        "An end-to-end machine learning pipeline for predicting loan approval from 12+ financial and demographic features.",
        "Covered preprocessing, feature engineering and exploratory analysis, then compared logistic regression, KNN, SVM, decision trees and ensemble methods.",
        "Used Pandas, Matplotlib and Seaborn for cleaning, visualisation and performance analysis."
      ],
      results: ["About 77% prediction accuracy"]
    },
    {
      id: "fifa", category: "ml", chart: "scatter",
      title: "FIFA player performance prediction",
      stack: ["R", "Linear regression"],
      link: "",
      summary: "Linear regression on SoFIFA player attributes, with a look at fairness and bias.",
      body: [
        "Predicted FIFA player performance from player attributes using a SoFIFA dataset, including cleaning, missing values and categorical encoding.",
        "Evaluated with MSE, RMSE and R², and discussed bias, fairness and privacy in player rating.",
        "Proposed non-linear and ensemble models as next steps."
      ]
    },
    {
      id: "jobpulse", category: "ml", chart: "hist",
      title: "JobPulse: job market scraper",
      stack: ["Python", "Requests", "BeautifulSoup", "Pandas"],
      link: "https://github.com/tisyavaidya/Web-Scrapping--Naukri.com",
      summary: "Scraped and structured 1,000+ Naukri.com job listings for market analysis.",
      body: [
        "A scraping pipeline that collects job title, company, location, experience and description from Naukri.com.",
        "Cleaned and transformed the data with Pandas into a structured dataset for trend analysis."
      ]
    },
    {
      id: "mindscope", category: "analytics", chart: "dashboard",
      title: "MindScope: workplace mental health dashboard",
      stack: ["Tableau"],
      link: "https://github.com/tisyavaidya/Mental-Health-Analysis-Dashboard-Tableau",
      summary: "An interactive dashboard over 1,200+ workplace mental health survey responses.",
      body: [
        "Visualisations of demographic trends, workplace support and how people report mental health.",
        "Filters, calculated fields and interactivity relate employee demographics and workplace policies to outcomes."
      ]
    },
    {
      id: "niftypulse", category: "analytics", chart: "line",
      title: "NiftyPulse: Nifty 50 market analysis",
      stack: ["Power BI", "DAX", "Power Query"],
      link: "https://github.com/tisyavaidya/NiftyPulse-Nifty-50-Market-Analysis",
      summary: "Five years of Nifty 50 index data in an interactive Power BI dashboard.",
      body: [
        "Prepared the data in Power Query and wrote DAX measures for financial indicators.",
        "Time-based visuals track price movements, yearly trends and market behaviour."
      ]
    },
    {
      id: "salesvision", category: "analytics", chart: "bars2",
      title: "SalesVision: sales analytics",
      stack: ["Excel", "Pivot tables"],
      link: "https://github.com/tisyavaidya/Sales-Dashboard-Excel",
      summary: "Pivot tables and slicers over 10,000+ sales records.",
      body: [
        "Tracks revenue, regional performance and product category trends.",
        "Interactive filters make it quick to find the top regions and products."
      ]
    },
    {
      id: "tripvista", category: "analytics", chart: "map",
      title: "TripVista: travel data analysis",
      stack: ["MySQL"],
      link: "https://github.com/tisyavaidya/Trip-Summary-SQL",
      summary: "A relational model of a travel booking system, queried for insight.",
      body: [
        "Models itineraries, bookings, destinations and reviews in a relational database.",
        "SQL analysis extracts patterns across trips and reviews."
      ]
    },
    {
      id: "cache", category: "software", chart: "blocks",
      title: "Multi-level cache",
      stack: ["Python", "Data structures"],
      link: "https://github.com/tisyavaidya/Cache",
      summary: "L1, L2 and L3 caches built from hash tables and linked lists.",
      body: [
        "A cache management system with three levels, built from hash tables and linked lists.",
        "Optimised storage and retrieval, with eviction policies at each level."
      ]
    },
    {
      id: "course-scheduler", category: "software", chart: "grid",
      title: "Course scheduler",
      stack: ["Java", "OOP", "NetBeans"],
      link: "https://github.com/tisyavaidya/Course-Scheduler",
      summary: "Admin and student roles for scheduling courses by semester.",
      body: [
        "Course scheduling software with two kinds of user.",
        "As admin you set up the database; students then schedule their courses by semester."
      ]
    },
    {
      id: "pizza", category: "software", chart: "pie",
      title: "Pizza servings calculator",
      stack: ["Java", "Swing"],
      link: "https://github.com/tisyavaidya/Pizza-Servings-Calculator-GUI-",
      summary: "A small GUI that works out servings from a pizza's size.",
      body: ["A Java Swing app: enter the diameter of a round pizza and it calculates how many servings it makes."]
    }
  ],

  /* ----------------------------------------------------------- Ask Tisya */
  // Answers are matched by keywords. Write them in your own words.
  ask: {
    suggestions: [
      "What are you studying?",
      "What kind of role are you looking for?",
      "What's your favourite project?",
      "What research have you done?"
    ],
    answers: [
      { keys: ["study", "studying", "master", "uppsala", "degree", "education", "university", "school"],
        a: "I'm doing a master's in Data Science at Uppsala University (2026–2028), specialising in Machine Learning and Statistics. Before that I did a B.S. in Computational Data Science at Penn State, with minors in Maths and Statistics." },
      { keys: ["looking", "role", "job", "internship", "hire", "hiring", "available", "open"],
        a: "I'm looking for data science and machine learning internships in Sweden and Europe. The quickest way to reach me is email: vaidyatisya19@gmail.com." },
      { keys: ["project", "projects", "built", "build", "portfolio"],
        a: "Probably my hate speech detection project: an ensemble of fine-tuned BERT and RoBERTa that reached 93% accuracy and lifted macro F1 from 0.70 to 0.79. All my projects are on the Projects page." },
      { keys: ["research", "autonomous", "vehicle", "odometry", "rls", "least squares", "robotics"],
        a: "Two projects at Penn State: making Recursive Least Squares models more robust to outliers (with Dr. Nilanjan Ray Chaudhuri), and stereo visual odometry for GNSS-denied navigation with the Autonomous Vehicle Team, using OpenCV, Python and ROS." },
      { keys: ["experience", "intern", "internships", "worked", "work", "company", "companies"],
        a: "I've interned at Digital Ipsum (data science, 2026), LTIMindtree (generative AI, 2024) and Tata Consultancy Services (data science, 2023). The Experience page has the details." },
      { keys: ["skill", "skills", "language", "languages", "python", "sql", "tools", "stack", "tech", "tableau", "power bi", "excel", "java", "matlab", "pandas", "scikit", "know"],
        a: "Mostly Python and SQL, plus R, Java and MATLAB. For ML and data: scikit-learn, Pandas, NumPy, Matplotlib and Seaborn, and transformer fine-tuning. For analytics: Tableau, Power BI and Excel." },
      { keys: ["teach", "teaching", "tutor", "tutoring", "assistant"],
        a: "I was a learning assistant at Penn State for CMPSC 221, Calculus 2 and Trigonometry, and a Python facilitator for the Women in Engineering Program." },
      { keys: ["generative", "genai", "gen ai", "image", "dall", "llm", "nlp"],
        a: "At LTIMindtree I worked on image generation with DALL·E and Gemini, instruction-based image editing and background removal with Azure AI. On the NLP side, my hate speech project fine-tuned BERT and RoBERTa." },
      { keys: ["contact", "email", "reach", "linkedin", "talk"],
        a: "Email me at vaidyatisya19@gmail.com, or find me on LinkedIn. Everything's on the Contact page." },
      { keys: ["resume", "résumé", "cv"],
        a: "You can open my résumé from the Résumé button at the top of every page." },
      { keys: ["hobby", "hobbies", "fun", "free time", "outside", "boxing", "cook", "travel"],
        a: "Outside of data, I box, cook and travel." },
      { keys: ["where", "location", "live", "based", "sweden", "relocate"],
        a: "I'm based in Uppsala, Sweden." }
    ],
    fallback: "I don't have an answer for that one yet. Email me at vaidyatisya19@gmail.com and I'll reply myself."
  }
};
