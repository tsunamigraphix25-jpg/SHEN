import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcryptjs";
import { users, articles, submissions } from "./schema";

async function seed() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  const db = drizzle(pool);

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 10);
  const editorHash = await bcrypt.hash("editor123", 10);

  await db.insert(users).values([
    {
      email: "admin@shen.org",
      passwordHash: adminHash,
      name: "SHEN Administrator",
      role: "admin",
      shenRole: "Platform Administrator",
      academicBackground: "MSc Occupational Health & Safety",
      bio: "Platform administrator for SHEN Knowledge Hub.",
    },
    {
      email: "beatrice@shen.org",
      passwordHash: editorHash,
      name: "Beatrice Moyo",
      role: "editor",
      shenRole: "Media & Communications Lead, SHEN",
      academicBackground: "BSc Environmental Science",
      bio: "Leading communications and media strategy at SHEN.",
    },
    {
      email: "john@shen.org",
      passwordHash: editorHash,
      name: "John Mabena",
      role: "member",
      shenRole: "Research Committee Member",
      academicBackground: "MSc Safety Management",
      bio: "Focused on industrial safety research and publications.",
    },
  ]).onConflictDoNothing();

  // Create sample articles
  await db.insert(articles).values([
    {
      title: "Understanding Occupational Health Risk Assessment in Mining",
      slug: "understanding-occupational-health-risk-assessment-mining",
      excerpt: "A comprehensive guide to conducting health risk assessments in the mining sector, covering key methodologies and regulatory frameworks.",
      content: `## Introduction\n\nOccupational health risk assessment is a fundamental process in the mining industry. This article explores the key methodologies, regulatory frameworks, and best practices that safety professionals should consider.\n\n## Key Methodologies\n\nRisk assessment in mining involves several critical steps:\n\n1. **Hazard Identification** — Systematically identifying potential health hazards including dust exposure, noise, vibration, and chemical agents.\n\n2. **Exposure Assessment** — Measuring and evaluating worker exposure levels through environmental monitoring and biological monitoring.\n\n3. **Risk Characterization** — Combining hazard and exposure data to determine the level of risk to worker health.\n\n## Regulatory Framework\n\nSouth African mining operations must comply with the Mine Health and Safety Act (MHSA) which mandates regular health risk assessments. The Department of Mineral Resources and Energy (DMRE) provides guidelines for conducting these assessments.\n\n## Best Practices\n\n- Involve workers in the risk assessment process\n- Use standardized assessment tools\n- Regular review and updating of assessments\n- Integration with occupational hygiene monitoring programs\n- Documentation and record keeping\n\n## Conclusion\n\nEffective occupational health risk assessment is essential for protecting mining workers. By following established methodologies and regulatory requirements, mining operations can significantly reduce health risks and create safer working environments.`,
      category: "article",
      status: "published",
      authorName: "John Mabena",
      authorPosition: "Research Committee Member",
      readingTime: 8,
      featured: true,
      references: "Mine Health and Safety Act, 1996; DMRE Guidelines 2024; ISO 45001:2018",
      viewCount: 234,
      publishedAt: new Date("2026-06-15"),
    },
    {
      title: "SHEN Partners with National Safety Council for 2026 Campaign",
      slug: "shen-partners-national-safety-council-2026",
      excerpt: "The Safety, Health and Environment Network announces a strategic partnership with the National Safety Council to promote workplace safety awareness across industries.",
      content: `## Partnership Announcement\n\nThe Safety, Health and Environment Network (SHEN) is proud to announce a strategic partnership with the National Safety Council (NSC) for the 2026 workplace safety campaign.\n\n## Objectives\n\nThis partnership aims to:\n\n- Raise awareness about workplace safety standards\n- Provide training resources to SHEN members\n- Conduct joint safety audits and assessments\n- Develop educational materials for students and professionals\n\n## Campaign Activities\n\nThe 2026 campaign will include:\n\n1. Monthly webinars on safety topics\n2. Quarterly safety workshops\n3. Annual OSHE conference\n4. Student engagement programs\n5. Industry site visits\n\n## Impact\n\nThis partnership represents a significant step forward in SHEN's mission to advance safety, health, and environmental excellence. Through collaboration with the NSC, we will be able to reach a broader audience and make a greater impact in promoting workplace safety.\n\n## Get Involved\n\nSHEN members interested in participating in the campaign activities can contact the Events Committee for more information.`,
      category: "news",
      status: "published",
      authorName: "Beatrice Moyo",
      authorPosition: "Media & Communications Lead, SHEN",
      readingTime: 4,
      featured: false,
      viewCount: 156,
      publishedAt: new Date("2026-07-01"),
    },
    {
      title: "Impact of Climate Change on Occupational Heat Exposure: A Systematic Review",
      slug: "impact-climate-change-occupational-heat-exposure",
      excerpt: "This systematic review examines the relationship between climate change and increasing occupational heat exposure risks across various industries.",
      content: `## Abstract\n\nClimate change is projected to significantly increase occupational heat exposure risks worldwide. This systematic review examines current literature on the impact of rising temperatures on worker health and productivity.\n\n## Introduction\n\nAs global temperatures continue to rise, outdoor and indoor workers face increasing risks from heat-related illnesses. This review synthesizes findings from recent studies to understand the scope of the problem and identify effective interventions.\n\n## Methodology\n\nA systematic search of PubMed, Scopus, and Web of Science databases was conducted for studies published between 2020 and 2026. Inclusion criteria focused on studies examining occupational heat exposure in the context of climate change.\n\n## Key Findings\n\n1. **Increased Exposure** — Workers in agriculture, construction, and mining face the highest increase in heat exposure.\n2. **Productivity Loss** — Heat stress can reduce labor productivity by up to 20% in affected sectors.\n3. **Health Outcomes** — Heat-related illnesses, cardiovascular stress, and kidney disease are on the rise.\n4. **Vulnerable Populations** — Informal sector workers and those in developing countries are disproportionately affected.\n\n## Recommendations\n\n- Implementation of heat stress management programs\n- Regular monitoring of workplace thermal conditions\n- Provision of adequate hydration and rest breaks\n- Development of heat-adapted work schedules\n- Training workers on heat illness recognition and prevention\n\n## Conclusion\n\nClimate change poses a significant and growing threat to occupational health. Proactive measures are needed to protect workers from increasing heat exposure risks.`,
      category: "research",
      status: "published",
      authorName: "John Mabena",
      authorPosition: "Research Committee Member",
      readingTime: 12,
      featured: false,
      abstractText: "Climate change is projected to significantly increase occupational heat exposure risks worldwide. This systematic review examines current literature on the impact of rising temperatures on worker health and productivity, analyzing studies from 2020-2026.",
      researchArea: "Environmental Health",
      citation: "Mabena, J. (2026). Impact of Climate Change on Occupational Heat Exposure: A Systematic Review. SHEN Knowledge Hub.",
      viewCount: 89,
      downloadCount: 34,
      publishedAt: new Date("2026-05-20"),
    },
    {
      title: "OSHE Talks Series: Workplace Mental Health in Post-Pandemic Era",
      slug: "oshe-talks-workplace-mental-health",
      excerpt: "Recap of the OSHE Talks event featuring industry leaders discussing mental health challenges and solutions in modern workplaces.",
      content: `## Event Overview\n\nThe SHEN OSHE Talks Series held its latest session focusing on Workplace Mental Health in the Post-Pandemic Era. The event brought together industry leaders, mental health professionals, and SHEN members.\n\n## Speakers\n\n- **Dr. Sarah Ndlovu** — Occupational Psychologist, WorkWell Institute\n- **Prof. Michael Tshabalala** — Head of Psychology, University of Johannesburg\n- **Ms. Nomsa Dlamini** — HR Director, Anglo American\n\n## Key Discussion Points\n\n### The Current Landscape\n\nThe pandemic has fundamentally changed how we view workplace mental health. Speakers highlighted the increasing prevalence of burnout, anxiety, and depression among workers.\n\n### Organizational Responsibilities\n\nEmployers have a legal and moral obligation to support employee mental health. This includes providing access to counseling services, creating supportive work environments, and training managers to recognize signs of mental distress.\n\n### Practical Solutions\n\n1. Employee Assistance Programs (EAPs)\n2. Mental health awareness training\n3. Flexible work arrangements\n4. Regular wellness check-ins\n5. Destigmatization campaigns\n\n## Takeaways\n\nThe event emphasized that mental health is an integral part of occupational health and safety. SHEN commits to continuing the conversation and providing resources for members.\n\n## Next Event\n\nThe next OSHE Talks will focus on "Safety Leadership in High-Risk Industries" — date to be announced.`,
      category: "event",
      status: "published",
      authorName: "Beatrice Moyo",
      authorPosition: "Media & Communications Lead, SHEN",
      readingTime: 6,
      eventDate: "2026-06-28",
      eventLocation: "University of Johannesburg, Doornfontein Campus",
      eventSpeakers: "Dr. Sarah Ndlovu, Prof. Michael Tshabalala, Ms. Nomsa Dlamini",
      viewCount: 198,
      publishedAt: new Date("2026-06-30"),
    },
    {
      title: "SHEN July 2026 Highlights",
      slug: "shen-july-2026-highlights",
      excerpt: "A visual journey through SHEN's activities in July 2026, featuring member activities, training sessions, and community engagement.",
      content: `## July 2026 Monthly Highlights\n\nJuly was an exciting month for SHEN with numerous activities, training sessions, and community engagement initiatives.\n\n### Member Activities\n\nOur members actively participated in various safety campaigns and educational programs throughout the month.\n\n### Training Sessions\n\nSHEN conducted multiple training sessions covering:\n- First Aid and Emergency Response\n- Fire Safety Management\n- Hazardous Materials Handling\n- Environmental Impact Assessment\n\n### Community Engagement\n\nSHEN members volunteered in community safety awareness programs, visiting local schools and community centers.\n\n### Behind the Scenes\n\nOur dedicated team worked tirelessly behind the scenes to plan upcoming events and develop new educational resources.`,
      category: "gallery",
      status: "published",
      authorName: "Beatrice Moyo",
      authorPosition: "Media & Communications Lead, SHEN",
      readingTime: 3,
      galleryMonth: "2026-07",
      viewCount: 312,
      publishedAt: new Date("2026-07-31"),
    },
    {
      title: "Fundamentals of Environmental Impact Assessment",
      slug: "fundamentals-environmental-impact-assessment",
      excerpt: "An educational overview of Environmental Impact Assessment (EIA) processes and their importance in sustainable development.",
      content: `## Introduction\n\nEnvironmental Impact Assessment (EIA) is a critical tool for ensuring that development projects consider their environmental consequences. This article provides an overview of the EIA process and its role in sustainable development.\n\n## What is EIA?\n\nAn Environmental Impact Assessment is a systematic process used to identify, predict, evaluate, and mitigate the environmental effects of proposed projects before major decisions and commitments are made.\n\n## The EIA Process\n\n### 1. Screening\nDetermining whether a proposed project requires an EIA.\n\n### 2. Scoping\nIdentifying the key environmental issues and establishing the terms of reference.\n\n### 3. Impact Analysis\nPredicting and evaluating the likely environmental impacts.\n\n### 4. Mitigation\nDeveloping measures to avoid, reduce, or compensate for adverse impacts.\n\n### 5. Reporting\nPreparing the Environmental Impact Statement (EIS).\n\n### 6. Review\nExamining the adequacy and effectiveness of the EIS.\n\n### 7. Decision-making\nApproving or rejecting the project based on the EIA findings.\n\n### 8. Monitoring\nTracking the environmental impacts of the project during implementation.\n\n## South African Context\n\nIn South Africa, EIA is regulated under the National Environmental Management Act (NEMA). The process is mandatory for listed activities that may have significant environmental impacts.\n\n## Conclusion\n\nEIA is an essential component of responsible development. By identifying and addressing environmental impacts early, we can promote sustainable development while protecting our natural resources.`,
      category: "article",
      status: "published",
      authorName: "John Mabena",
      authorPosition: "Research Committee Member",
      readingTime: 7,
      viewCount: 145,
      publishedAt: new Date("2026-04-10"),
    },
  ]).onConflictDoNothing();

  // Create sample submissions
  await db.insert(submissions).values([
    {
      fullName: "Sarah Khumalo",
      shenPosition: "Student Member",
      email: "sarah.k@student.uj.ac.za",
      category: "article",
      title: "Noise-Induced Hearing Loss Prevention in Manufacturing",
      description: "An article discussing the prevalence of noise-induced hearing loss in manufacturing and strategies for prevention.",
      status: "pending",
    },
    {
      fullName: "David Mokoena",
      shenPosition: "Associate Member",
      email: "david.m@company.co.za",
      category: "research",
      title: "Ergonomic Risk Factors in Remote Work Settings",
      description: "A research paper examining ergonomic challenges faced by remote workers and proposing intervention strategies.",
      status: "under_editing",
    },
  ]).onConflictDoNothing();

  await pool.end();
  console.log("Seed completed successfully!");
}

seed().catch(console.error);
