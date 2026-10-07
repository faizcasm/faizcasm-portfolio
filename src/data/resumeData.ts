export const resumeData = {
  personalInfo: {
    name: "Faizan Hameed",
    title:
      "Software Engineer | Backend & Distributed Systems | Full-Stack | Agentic AI / LLM Engineering",
    shortTitle: "Software Engineer / Agentic AI Engineer",
    email: "faizanhameed690@gmail.com",
    phone: "+91 91495 22458",
    location: "Jammu & Kashmir, India",
    github: "https://github.com/faizcasm",
    website: "https://faizcasm.me",
    summary:
      "Software Engineer focused on backend architecture, distributed systems, full-stack products, and production AI. Builds reliable services and agentic systems with TypeScript/Node.js, PostgreSQL, Redis, Docker, AWS, and modern LLM tooling. Hands-on with agent planning, tool calling, RAG, memory, multi-agent workflows, structured outputs, human-in-the-loop controls, evaluation, observability, retries, and long-running execution. Founder and lead engineer of Ryuksaidso, an agent reliability and control-plane platform. Uses AI coding and research tools to accelerate implementation, debugging, documentation, refactoring, and test generation, followed by human review, automated validation, security checks, and architecture verification before changes ship.",
  },
  skillGroups: [
    { category: "Languages", items: ["TypeScript", "JavaScript", "SQL", "Python"] },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "Fastify",
        "NestJS",
        "REST APIs",
        "WebSockets",
        "Microservices",
        "Event-Driven Architecture",
      ],
    },
    { category: "Frontend", items: ["React.js", "Next.js", "Redux", "Tailwind CSS"] },
    { category: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "pgvector", "Prisma"] },
    {
      category: "AI / Agents",
      items: [
        "AI Agents",
        "Multi-Agent Systems",
        "Planning",
        "Tool Calling",
        "Memory",
        "RAG",
        "Embeddings",
        "Structured Outputs",
        "HITL",
        "LangChain",
        "LangGraph",
      ],
    },
    {
      category: "LLM Engineering",
      items: [
        "Local LLMs",
        "Secure LLM Harnesses",
        "Fine-Tuning",
        "LoRA/QLoRA",
        "Quantization",
        "GGUF",
        "Inference Optimization",
        "Model Routing",
      ],
    },
    {
      category: "Cloud / DevOps",
      items: [
        "AWS EC2",
        "IAM",
        "Docker",
        "Docker Compose",
        "NGINX",
        "CI/CD",
        "Linux",
        "Prometheus",
        "Grafana",
        "Loki",
      ],
    },
    {
      category: "Engineering",
      items: [
        "System Design",
        "Distributed Systems",
        "API Security",
        "Authentication",
        "RBAC",
        "Rate Limiting",
        "Caching",
        "Observability",
        "Performance",
        "DSA",
      ],
    },
    {
      category: "AI-Augmented Development",
      items: [
        "LLM-assisted coding",
        "Debugging",
        "Test generation",
        "Documentation",
        "Implementation acceleration",
        "Verification",
        "Human-in-the-loop review",
      ],
    },
  ],
  experience: [
    {
      position: "Founder & Lead Software / AI Engineer",
      company: "Ryuksaidso",
      startDate: "2026",
      endDate: "Present",
      bullets: [
        "Built and deployed Ryuksaidso, an agent reliability and control-plane platform for operating AI agents with production software discipline.",
        "Designed the control plane around agent definitions, tools, providers, versions, runs, traces, approvals, policies, API keys, RBAC, tenant isolation, audit history, and operational visibility.",
        "Implemented durable agent execution with planning, task decomposition, tool calls, memory/state, structured outputs, retries, recovery, approvals, execution traces, and long-running jobs.",
        "Built asynchronous execution with Redis/BullMQ workers and separated synchronous API traffic from long-running agent workloads for reliability and horizontal scaling.",
        "Implemented PostgreSQL + Prisma for transactional state, pgvector for retrieval, and Redis for queues, caching, locks, and coordination.",
        "Integrated OmniRoute, Ollama, and OpenAI-compatible providers with routing, retries, and failover; supported local/cloud and quantized model workflows.",
        "Use AI tools as engineering accelerators for implementation, investigation, refactoring, documentation, and tests, followed by code review, automated validation, security checks, and architecture review.",
      ],
    },
    {
      position: "Full Stack Engineer",
      company: "Locrave",
      startDate: "Dec 2025",
      endDate: "Apr 2026",
      bullets: [
        "Developed and maintained a location-based full-stack platform with secure authentication, scalable APIs, and production-oriented application architecture.",
        "Built frontend and backend functionality using React, TypeScript, Node.js, PostgreSQL, and REST APIs.",
        "Designed database interactions, optimized queries, integrated APIs, and contributed to application performance and reliability.",
      ],
    },
    {
      position: "Founder & Lead Backend Engineer",
      company: "Wolvinix",
      startDate: "2024",
      endDate: "2025",
      bullets: [
        "Architected backend infrastructure for a gaming-focused social platform using Node.js and TypeScript.",
        "Designed scalable REST APIs, authentication, authorization, and WebSocket-based real-time communication.",
        "Integrated Redis for caching and high-performance workloads; containerized services and deployment workflows with Docker.",
        "Worked across database integration, API performance, scalability, reliability, and production deployment.",
      ],
    },
    {
      position: "Backend Developer Intern",
      company: "Arcnet IT Solutions",
      startDate: "",
      endDate: "",
      bullets: [
        "Developed and maintained backend APIs for production-oriented applications.",
        "Worked on database integration, query optimization, backend performance, reliability, and scalable application functionality.",
      ],
    },
    {
      position: "Full Stack Intern",
      company: "Upskill Mafia",
      startDate: "Aug 2023",
      endDate: "Feb 2024",
      bullets: [
        "Developed full-stack application features using modern JavaScript technologies.",
        "Built REST APIs, dashboards, authentication flows, and user-facing functionality.",
      ],
    },
  ],
  ryuksaidsoProduct: {
    name: "Ryuksaidso",
    subtitle: "Product & Engineering",
    live: "https://ryuksaidso.online",
    description:
      "Production-oriented agent reliability and control plane designed to operate AI agents with production software discipline. The platform centers on planning, tracing, approvals, evaluations, versioning, knowledge retrieval, and multi-provider failover.",
    pillars: [
      {
        title: "Control Plane",
        detail:
          "Next.js/React dashboard for users, workspaces, agents, tools, providers, runs, approvals, traces, analytics, profiles, and administration.",
      },
      {
        title: "API Layer",
        detail:
          "Stateless TypeScript/Node.js services with validation, authentication, RBAC, rate limiting, provider routing, health/readiness endpoints, and horizontal-scaling support.",
      },
      {
        title: "Agent Runtime",
        detail:
          "Planning, task decomposition, tool calls, memory/state, structured outputs, retries, human approval, execution traces, and recovery.",
      },
      {
        title: "Async Compute",
        detail:
          "Redis + BullMQ workers for long-running agent execution, browser automation, ingestion, scheduled jobs, retries, and workload isolation.",
      },
      {
        title: "Data Layer",
        detail:
          "PostgreSQL + Prisma for transactional data, pgvector for semantic retrieval, and Redis for queues, caching, locks, and coordination.",
      },
      {
        title: "LLM Layer",
        detail:
          "OmniRoute, Ollama, and OpenAI-compatible providers with local/cloud routing, quantized/fine-tuned model support, and controlled tool execution.",
      },
      {
        title: "Production Infrastructure",
        detail:
          "Dockerized services on AWS EC2 behind NGINX with IAM, security groups/firewall controls, service isolation, health checks, and controlled network exposure.",
      },
      {
        title: "Reliability & Safety",
        detail:
          "Human-in-the-loop approval gates, restricted tool permissions, policy enforcement, structured validation, auditability, retries, timeouts, and persistent execution state.",
      },
      {
        title: "Observability",
        detail:
          "Prometheus metrics, Grafana dashboards, Loki logs, audit trails, agent traces, worker visibility, and operational health monitoring.",
      },
    ],
  },
  projects: [
    {
      name: "Ryuksaidso",
      subtitle: "Agent Reliability & Control-Plane Platform",
      link: "https://ryuksaidso.online",
      repo: "https://github.com/faizcasm",
      bullets: [
        "Production-oriented control plane for operating AI agents with planning, tracing, approvals, evaluations, versioning, knowledge retrieval, and multi-provider failover.",
        "Runs on a Next.js/React dashboard, stateless TypeScript/Node.js services, Redis + BullMQ workers, PostgreSQL + Prisma with pgvector, and Dockerized AWS EC2 infrastructure behind NGINX.",
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "pgvector", "Docker", "AWS"],
    },
    {
      name: "Wolvinix",
      subtitle: "Real-Time Gaming Social Platform",
      link: "https://github.com/faizcasm/wolvinix",
      repo: "https://github.com/faizcasm/wolvinix",
      bullets: [
        "Built a gaming-focused social platform with real-time communication, authentication, scalable APIs, Redis-backed functionality, and Dockerized backend services.",
      ],
      technologies: ["React", "TypeScript", "Node.js", "WebSockets", "Redis", "PostgreSQL", "Docker"],
    },
    {
      name: "BackendOS",
      subtitle: "Open-Source Backend Framework / Toolkit",
      link: "https://github.com/faizcasm/BackendOS",
      repo: "https://github.com/faizcasm/BackendOS",
      bullets: [
        "Designed reusable production-oriented backend primitives covering authentication, API architecture, middleware, and database integration.",
      ],
      technologies: ["TypeScript", "Node.js", "Express.js", "PostgreSQL", "REST APIs"],
    },
  ],
  agenticAI: [
    "Algorithms: Solved 150+ DSA problems across core algorithmic patterns and problem-solving techniques.",
    "Agentic AI: Design and implement autonomous and supervised agents, multi-agent coordination, planning, tool execution, memory, RAG, stateful workflows, evaluation, streaming, and recovery.",
    "LLM Systems: Build secure local-LLM harnesses, work with quantized models and GGUF workflows, fine-tune adapters, optimize inference, and implement model/provider routing.",
    "Production Engineering: Dockerized services, AWS EC2 deployment, reverse proxy/load balancing, background workers, observability, caching, rate limiting, authentication, RBAC, and reliability patterns.",
    "AI-assisted engineering: Use AI tools as force multipliers for implementation, investigation, refactoring, documentation, and tests while retaining responsibility for correctness, security, architecture, and final code review.",
  ],
  openSource: [
    "Founder, Ryuksaidso — agent reliability/control plane, agent orchestration, automation, secure local AI, and scalable backend systems.",
    "Creator, BackendOS — open-source backend framework/toolkit for reusable production-oriented architecture.",
  ],
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "National Institute of Electronics & Information Technology (NIELIT), Srinagar",
      startDate: "",
      endDate: "Currently Pursuing",
      description: "",
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Punjab Technical University",
      startDate: "2023",
      endDate: "2026",
      description: "Completed",
    },
  ],
} as const;

export type ResumeData = typeof resumeData;
