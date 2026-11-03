/* ==========================================================================
   All the site's content lives here. Edit this file to update the website.
   ========================================================================== */

window.SITE = {
  name: "Tisya Vaidya",
  status: "Open to data science, ML and AI internships",
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
      id: "digital-ipsum", kind: "work", project: "marketing-roi",
      role: "Data Science Intern", org: "Digital Ipsum Pvt. Ltd.", place: "Remote",
      start: "2026-06", end: "2026-08", dates: "Jun 2026 – Aug 2026",
      points: [
        "Designed the matching logic for a therapist–client matching system and integrated personalised recommendations into the company website.",
        "Built a model to predict digital marketing campaign ROI, covering preprocessing, exploratory analysis, feature selection and evaluation."
      ]
    },
    {
      id: "avt", kind: "research", short: "Autonomous vehicles researcher",
      role: "Applied Researcher, Autonomous Vehicles", org: "Penn State Autonomous Vehicle Team", place: "University Park, USA",
      start: "2025-01", end: "2025-05", dates: "Jan 2025 – May 2025",
      points: [
        "Researched stereo visual odometry for navigation without GNSS.",
        "Wrote feature extraction, pose estimation and trajectory reconstruction with OpenCV, Python and ROS.",
        "Built visual odometry pipelines with FLIR Blackfly S stereo cameras for depth mapping and trajectory reconstruction."
      ]
    },
    {
      id: "rls", kind: "research",
      role: "Research Assistant", org: "Penn State, with Dr. Nilanjan Ray Chaudhuri", place: "University Park, USA",
      start: "2024-05", end: "2024-08", dates: "May 2024 – Aug 2024",
      points: [
        "Worked on making Recursive Least Squares models in MATLAB more robust.",
        "Tested methods to reduce the impact of outliers, so the model's estimates stayed accurate and reliable."
      ]
    },
    {
      id: "ltim", kind: "work",
      role: "Generative AI Intern", org: "LTIMindtree", place: "Mumbai, India",
      start: "2024-05", end: "2024-07", dates: "May 2024 – Jul 2024",
      points: [
        "Implemented image generation with models like DALL·E and Gemini, producing high-resolution 3D images.",
        "Tested instruction-based image editing, working from research papers.",
        "Implemented background removal with Microsoft Azure AI services.",
        "Facilitated product data collection from eBay with Scrapy, BeautifulSoup and Selenium."
      ]
    },
    {
      id: "tcs", kind: "work",
      role: "Data Science Intern", org: "Tata Consultancy Services", place: "Mumbai, India",
      start: "2023-06", end: "2023-07", dates: "Jun 2023 – Jul 2023",
      points: [
        "Turned raw client data in Excel into clean, accessible data with BW/4HANA and Google Looker.",
        "Built a front end on SAP AppGyver and integrated it with the back end."
      ]
    },
    {
      id: "la-221", kind: "teaching", short: "Learning Assistant, CMPSC 221",
      role: "Learning Assistant, CMPSC 221: Object-Oriented Programming with Web-Based Applications", org: "Penn State", place: "University Park, USA",
      start: "2023-08", end: "2025-05", dates: "Aug 2023 – May 2025",
      points: [
        "Helped students understand the course concepts.",
        "Refined course content with the professor and TAs, and graded exams, assignments and projects."
      ]
    },
    {
      id: "wie", kind: "teaching", short: "Python Facilitator, CMPSC 131",
      role: "Python Facilitator, CMPSC 131: Programming and Computation I", org: "Penn State Women in Engineering Program", place: "University Park, USA",
      start: "2022-08", end: "2025-05", dates: "Aug 2022 – May 2025",
      points: [
        "Wrote and taught lesson plans for CMPSC 131 (Python).",
        "Adapted exercises and assessments to help students prepare for exams."
      ]
    },
    {
      id: "la-trig", kind: "teaching", short: "Learning Assistant, MATH 041",
      role: "Learning Assistant, MATH 041: Trigonometry and Analytic Geometry", org: "Penn State Eberly College of Science", place: "University Park, USA",
      start: "2024-08", end: "2024-12", dates: "Aug 2024 – Dec 2024",
      points: ["Ran tutoring sessions and gave problem-solving support."]
    },
    {
      id: "la-calc", kind: "teaching", short: "Learning Assistant, MATH 141",
      role: "Learning Assistant, MATH 141: Calculus with Analytic Geometry II", org: "Penn State Eberly College of Science", place: "University Park, USA",
      start: "2023-01", end: "2023-05", dates: "Jan 2023 – May 2023",
      points: ["Tutored students, using tools like Minitab and Wolfram Alpha."]
    }
  ],

  education: [
    {
      school: "Uppsala University", place: "Uppsala, Sweden",
      degree: "M.S. in Data Science, Machine Learning and Statistics track", dates: "Aug 2026 – Jun 2028"
    },
    {
      school: "The Pennsylvania State University", place: "University Park, USA",
      degree: "B.S. in Computational Data Science, minors in Mathematics and Statistics", dates: "Aug 2021 – May 2025"
    }
  ],

  // What I'm doing this term (the me.now() cell on the home page)
  now: {
    term: "Autumn 2026",
    courses: ["Statistical Machine Learning", "Modelling for Combinatorial Optimisation"],
    exploring: ["LLMs", "generative AI", "RAG", "NLP"],
    learning: "Swedish (A2)"
  },

  // The me.fun_facts cell on the About page: [key, value] pairs
  funFacts: [
    ["countries_called_home", ["India", "USA", "Sweden"]],
    ["cats_back_home_in_india", 5],
    ["favourite_swedish_thing", "fika (and the bakeries)"],
    ["food", ["anything spicy", "desserts"]],
    ["binge_watching", ["rom-coms", "supernatural series"]],
  ],

  languages: ["English", "Hindi", "Marathi", "Swedish (learning, A2)"],

  // Courses (the me.courses cell on the About page): [degree, course, area]
  courses: [
    ["Master's (Uppsala)", "Statistical Machine Learning", "Machine learning"],
    ["Master's (Uppsala)", "Modelling for Combinatorial Optimisation", "Optimisation"],
    ["Bachelor's (Penn State)", "Machine Learning and AI", "Machine learning"],
    ["Bachelor's (Penn State)", "Artificial Intelligence", "Machine learning"],
    ["Bachelor's (Penn State)", "Applied Data Sciences", "Data science"],
    ["Bachelor's (Penn State)", "Data Science Through Statistical Reasoning and Computation", "Data science"],
    ["Bachelor's (Penn State)", "Data Management for Data Sciences", "Data science"],
    ["Bachelor's (Penn State)", "Programming Models for Big Data", "Data science"],
    ["Bachelor's (Penn State)", "Introduction to Mathematical Statistics", "Statistics"],
    ["Bachelor's (Penn State)", "Applied Regression Analysis", "Statistics"]
  ],

  skills: [
    ["Languages", "Python, SQL"],
    ["Data analysis", "NumPy, pandas, Matplotlib"],
    ["Machine learning", "scikit-learn: regression, classification, model evaluation"],
    ["Analytics", "Excel, Tableau, Power BI"]
  ],

  /* ------------------------------------------------------------ Projects */
  // category: "ml" | "analytics"
  // chart: the little picture on the card (bars, line, scatter, heatmap, pie, hist, grid, blocks, map, dashboard, curve)
  // link: GitHub URL, or "" if there isn't a public repo
  // Optional extras:
  //   data:     real numbers for the card's chart, e.g. {type: "bars" | "hbars" | "heatmap", labels, values, unit, highlight, title}
  //   thumb:    an image to use on the card instead of a chart
  //   images:   real outputs shown in the write-up: [{src, caption}]
  //   notebook: an nbviewer link to the project's notebook
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
      results: ["Ensemble accuracy 93% and macro F1 0.79 on 4,957 test tweets, against 0.75 macro F1 for BERT alone and 0.76 for RoBERTa alone", "The hardest class was hate speech itself: 47% recall, because most hateful tweets were confused with merely offensive ones", "Non-hateful profanity detection from 72% to 85%", "Negated hate speech from 68% to 83%; reclaimed slurs from 65% to 82%"],
      data: {"type": "heatmap", "labels": ["hate", "offensive", "neither"], "values": [[0.47, 0.49, 0.05], [0.03, 0.96, 0.01], [0.01, 0.06, 0.93]], "title": "Ensemble confusion matrix (row share)"},
      notebook: "https://nbviewer.org/github/tisyavaidya/DS340W--Project/blob/main/stacked_model.ipynb",
      images: [{"src": "assets/projects/hate-speech-confusion.jpg", "caption": "Confusion matrix of the ensemble (averaging probabilities), from stacked_model.ipynb"}]
    },
    {
      id: "marketing-roi", category: "ml", chart: "bars",
      title: "Marketing campaign ROI prediction",
      stack: ["Python", "scikit-learn", "Gradient Boosting", "Pandas"],
      link: "https://github.com/tisyavaidya/digitalipsum-internship",
      notebook: "https://nbviewer.org/github/tisyavaidya/digitalipsum-internship/blob/main/marketing-roi-prediction/predictive_analytics_digital_marketing_roi.ipynb",
      summary: "Built during my Digital Ipsum internship: predicting the ROI of 20,000 digital marketing campaigns.",
      data: {"type": "bars", "labels": ["GBoost", "Forest", "Lasso", "Linear", "AdaBoost", "Tree"], "values": [0.75, 0.73, 0.66, 0.66, 0.62, 0.49], "highlight": 0, "title": "R² on held-out campaigns, by model"},
      body: [
        "Part of my data science internship at Digital Ipsum: predict the return on investment of a digital marketing campaign from its setup and performance, so budget can go to the campaigns likely to pay off.",
        "Built a scikit-learn pipeline (imputation, scaling and one-hot encoding into 41 features), compared seven regressors on 16,000 training and 4,000 test campaigns, and tuned the best one with a 5-fold grid search.",
        "Checked the model with feature importance, actual-vs-predicted and residual plots."
      ],
      results: [
        "Tuned Gradient Boosting explained 75% of the variance in ROI on unseen campaigns (R² 0.747, MAE 1.50), with stable cross-validation (0.748 ± 0.006)",
        "Tree ensembles clearly beat linear models (R² 0.74 against 0.66), pointing to non-linear effects",
        "Acquisition cost dominated, at 86% of feature importance, followed far behind by customer segment and conversions"
      ],
      images: [
        {"src": "assets/projects/marketing-roi-actual-vs-predicted.jpg", "caption": "Actual vs predicted ROI for the tuned Gradient Boosting model"},
        {"src": "assets/projects/marketing-roi-features.jpg", "caption": "Top 15 features influencing ROI"}
      ]
    },
    {
      id: "loanlens", category: "ml", chart: "bars",
      title: "LoanLens: loan approval prediction",
      stack: ["Python", "scikit-learn", "Pandas", "Seaborn"],
      link: "https://github.com/tisyavaidya/Loan-Approval-Prediction-Model",
      summary: "Compared five model families on 500+ loan applications; ensembles did best at 81% accuracy.",
      body: [
        "An end-to-end machine learning pipeline for predicting loan approval from 12+ financial and demographic features.",
        "Covered preprocessing, feature engineering and exploratory analysis, then compared logistic regression, KNN, SVM, decision trees and ensemble methods.",
        "Used Pandas, Matplotlib and Seaborn for cleaning, visualisation and performance analysis."
      ],
      results: ["Ensembles (random forest, gradient boosting and XGBoost) reached 81% test accuracy; a single decision tree was lowest at 68%", "Credit history was the clearest signal: applicants with a good credit history were approved far more often"],
      data: {"type": "bars", "labels": ["LogReg", "KNN", "SVM", "Tree", "Ensemble"], "values": [75, 76, 76, 68, 81], "unit": "%", "highlight": 4, "title": "Test accuracy by model"},
      notebook: "https://nbviewer.org/github/tisyavaidya/Loan-Approval-Prediction-Model/blob/main/LoanApprovalPrediction.ipynb",
      images: [{"src": "assets/projects/loanlens-credit-history.jpg", "caption": "Approval by credit history: the clearest signal in the data"}, {"src": "assets/projects/loanlens-knn.jpg", "caption": "KNN accuracy for each value of K; K = 25 was best at 76%"}]
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
      summary: "Scraped data analyst listings from Naukri.com and measured which skills employers ask for most.",
      body: [
        "A scraping pipeline that collects job title, company, location, experience and description from Naukri.com.",
        "Cleaned and transformed the data with Pandas into a structured dataset for trend analysis."
      ],
      data: {"type": "hbars", "labels": ["data analysis", "power bi", "data analytics", "sql", "analytics", "python"], "values": [36, 19, 19, 16, 15, 13], "highlight": 3, "title": "Listings mentioning each skill"},
      notebook: "https://nbviewer.org/github/tisyavaidya/Web-Scrapping--Naukri.com/blob/main/Web%20Scrapping-%20Naukri.com.ipynb",
      results: ["In 60 data analyst listings, the most requested skills were data analysis (36 listings), Power BI (19), SQL (16) and Python (13)"]
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
      ],
      data: {"type": "bars", "labels": ["1–5", "6–25", "26–100", "100–500", "500–1k", "1k+"], "values": [12, 21, 35, 45, 58, 65], "unit": "%", "highlight": 5, "title": "Have mental health benefits, by company size"},
      images: [{"src": "assets/projects/mindscope-dashboard.jpg", "caption": "Dashboard overview (the thumbnail saved in the Tableau workbook)"}],
      results: ["Mental health benefits rise with company size: 12% of people at companies with 1–5 employees had them, against 65% at companies with more than 1,000", "70% of women in the survey had sought treatment, against 45% of men"]
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
      ],
      thumb: "assets/projects/niftypulse-dashboard.jpg",
      images: [{"src": "assets/projects/niftypulse-dashboard.jpg", "caption": "The Power BI dashboard, from the exported PDF in the repo"}],
      results: ["Between 2020 and 2025 the index closed as low as 7,610 and as high as 26,216, with an average close of 18,552", "Trading volume peaked in 2020 and fell by more than half by 2023, even as prices kept climbing"]
    },
    {
      id: "salesvision", category: "analytics", chart: "bars2",
      title: "SalesVision: sales analytics",
      stack: ["Excel", "Pivot tables"],
      link: "https://github.com/tisyavaidya/Sales-Dashboard-Excel",
      summary: "Pivot tables and slicers over 8,300+ sales records from 2021 to 2024.",
      body: [
        "Tracks revenue, regional performance and product category trends.",
        "Interactive filters make it quick to find the top regions and products."
      ],
      data: {"type": "bars", "labels": ["Furniture", "Office supplies", "Technology"], "values": [17.9, 108.2, 121.9], "unit": "k", "prefix": "$", "highlight": 0, "title": "Profit by category"},
      results: ["Furniture made 32% of the $1.93M in sales but only 7% of the $248K profit", "Tables were the biggest loss-maker, losing $12.3K over four years", "California and New York together brought in a third of all sales"]
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
      ],
      thumb: "assets/projects/tripvista-er.jpg",
      images: [{"src": "assets/projects/tripvista-er.jpg", "caption": "Entity-relationship diagram, from the project slides"}],
      results: ["Six normalised tables (users, trips, destinations, activities, bookings and reviews), queried with four multi-table joins, five subqueries and three reporting views"]
    },
  ],

  /* ----------------------------------------------------------- Ask Tisya */
  // Answers are matched by keywords. Write them in your own words.
  ask: {
    suggestions: [
      "What are you studying?",
      "What kind of role are you looking for?",
      "What's your favourite project?",
      "What research have you done?",
      "What do you do for fun?"
    ],
    answers: [
      { keys: ["study", "studying", "master", "uppsala", "degree", "education", "university", "school"],
        a: "I'm doing a master's in Data Science at Uppsala University (2026–2028), on the Machine Learning and Statistics track. Before that I did a B.S. in Computational Data Science at Penn State, with minors in Maths and Statistics." },
      { keys: ["looking", "role", "job", "internship", "hire", "hiring", "available", "open"],
        a: "I'm looking for data science, machine learning and AI internships in Sweden and Europe. The quickest way to reach me is email: vaidyatisya19@gmail.com." },
      { keys: ["project", "projects", "built", "build", "portfolio"],
        a: "Probably my hate speech detection project: an ensemble of fine-tuned BERT and RoBERTa that reached 93% accuracy and lifted macro F1 from 0.70 to 0.79. All my projects are on the Projects page." },
      { keys: ["research", "autonomous", "vehicle", "odometry", "rls", "least squares", "robotics"],
        a: "Two projects at Penn State: making Recursive Least Squares models more robust to outliers (with Dr. Nilanjan Ray Chaudhuri), and stereo visual odometry for GNSS-denied navigation with the Autonomous Vehicle Team, using OpenCV, Python and ROS." },
      { keys: ["experience", "intern", "internships", "worked", "work", "company", "companies"],
        a: "I've interned at Digital Ipsum (data science, 2026), LTIMindtree (generative AI, 2024) and Tata Consultancy Services (data science, 2023). The Experience page has the details." },
      { keys: ["are you learning", "learning now", "currently learning", "rag", "retrieval", "large language", "llms", "llm"],
        a: "Right now I'm going deeper into AI: LLMs, generative AI, retrieval-augmented generation (RAG) and NLP." },
      { keys: ["skill", "skills", "python", "sql", "tools", "stack", "tech", "tableau", "power bi", "excel", "java", "matlab", "pandas", "scikit", "know"],
        a: "Python (NumPy, pandas, Matplotlib, scikit-learn) and SQL for data analysis and machine learning, plus Excel, Tableau and Power BI for analytics and dashboards." },
      { keys: ["teach", "teaching", "tutor", "tutoring", "assistant"],
        a: "I was a learning assistant at Penn State for CMPSC 221, Calculus 2 and Trigonometry, and a Python facilitator for the Women in Engineering Program." },
      { keys: ["generative", "genai", "gen ai", "image", "dall", "llm", "nlp"],
        a: "At LTIMindtree I worked on image generation with DALL·E and Gemini, instruction-based image editing and background removal with Azure AI. On the NLP side, my hate speech project fine-tuned BERT and RoBERTa." },
      { keys: ["contact", "email", "reach", "linkedin", "talk"],
        a: "Email me at vaidyatisya19@gmail.com, or find me on LinkedIn. Everything's on the Contact page." },
      { keys: ["resume", "résumé", "cv"],
        a: "You can open my résumé from the Résumé button at the top of every page." },
      { keys: ["hobby", "hobbies", "fun", "free time", "outside", "weekend", "netflix", "watch", "show", "shows"],
        a: "In my free time I binge-watch Netflix, usually rom-coms or supernatural series. I also love food, especially anything spicy, and desserts." },
      { keys: ["cat", "cats", "pet", "pets", "animal"],
        a: "I have five cats back home in India." },
      { keys: ["fika", "food", "eat", "bakery", "bakeries", "spicy", "dessert", "desserts", "cook"],
        a: "I love eating, especially spicy food and desserts. Sweden's fika culture and its bakeries are one of my favourite things about living here." },
      { keys: ["india", "usa", "america", "move", "moved", "abroad", "grew up", "where are you from", "background", "culture", "adapt"],
        a: "I moved from India to the USA for my bachelor's at Penn State, then to Sweden for my master's at Uppsala. I adapt quickly to new places and cultures." },
      { keys: ["language", "languages", "speak", "swedish", "hindi", "marathi", "english"],
        a: "I speak English, Hindi and Marathi, and I'm learning Swedish (currently A2)." },
      { keys: ["course", "courses", "class", "classes", "taking", "semester", "term"],
        a: "This term at Uppsala I'm taking Statistical Machine Learning and Modelling for Combinatorial Optimisation. The About page lists more of my courses." },
      { keys: ["where", "location", "live", "based", "sweden", "relocate"],
        a: "I'm based in Uppsala, Sweden." }
    ],
    fallback: "I don't have an answer for that one yet. Email me at vaidyatisya19@gmail.com and I'll reply myself."
  }
};
